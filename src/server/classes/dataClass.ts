import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { replicationMiddleware } from "server/modules/rodux/middlewares/replicationMiddleware";
import { createSpyMiddleware } from "shared/mocks/middleware/spyMiddleware";
import { remotes } from "shared/remotes";
import { Store, StoreActions, storeReducer, StoreState, ValidProfile } from "shared/rodux";
import { defaultAccoladeState } from "shared/rodux/accolade";
import { defaultBoosts } from "shared/rodux/boosts";
import { defaultCurrencies } from "shared/rodux/currencies";
import { defaultTalismanId } from "shared/rodux/currentTalisman";
import { defaultCurrentWeaponState } from "shared/rodux/currentWeapon";
import { defaultDevProductState } from "shared/rodux/devProducts";
import { defaultEggs } from "shared/rodux/eggs";
import { defaultGamepasses } from "shared/rodux/gamepasses";
import { defaultMediaState } from "shared/rodux/media";
import { defaultPetMasteryState } from "shared/rodux/petMastery";
import { defaultPets } from "shared/rodux/pets";
import { defaultPetTeamsState } from "shared/rodux/petTeams";
import { defaultPlayerIndex } from "shared/rodux/playerIndex";
import { defaultRank } from "shared/rodux/rank";
import { defaultSettings } from "shared/rodux/settings";
import { defaultSpinWheel } from "shared/rodux/spinWheel";
import { defaultTalismans } from "shared/rodux/talismans";
import { defaultWeaponsState } from "shared/rodux/weapons";
import { defaultWorlds } from "shared/rodux/worlds";
import { getOrSetDefault } from "shared/util/getOrSetDefault";

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };
const storeCreationCallbacks: Map<Player, Array<(store: Store) => void>> = new Map();

const profileTemplate: ValidProfile = {
	accolades: defaultAccoladeState,
	boosts: defaultBoosts,
	currencies: defaultCurrencies,
	currentWeapon: defaultCurrentWeaponState,
	eggs: defaultEggs,
	gamepasses: defaultGamepasses,
	media: defaultMediaState,
	pets: defaultPets,
	rank: defaultRank,
	settings: defaultSettings,
	titles: undefined,
	weapons: defaultWeaponsState,
	worlds: defaultWorlds,
	talismans: defaultTalismans,
	currentTalisman: defaultTalismanId,
	petMastery: defaultPetMasteryState,
	spinWheel: defaultSpinWheel,
	petTeams: defaultPetTeamsState,
	playerIndex: defaultPlayerIndex,
	devProducts: defaultDevProductState,
};

/**
 * Initializes a player's saved profile upon joining, initializes a rodux store for the player, and saves any progress made upon player leaving.
 */
export class dataClass {
	/**
	 * The ProfileService profile store.
	 */
	public static profileStore = ProfileService.GetProfileStore("mainstore", profileTemplate);

	/**
	 * A collection of all player profiles.
	 */
	public static playerProfiles: Map<number, Profile<ValidProfile>> = new Map();

	/**
	 * Collection of rodux stores.
	 */
	public static stores: Map<Player, Store> = new Map();

	/**
	 * Loads and compares cached/saved player data with the profile template.
	 *
	 * @param player The player object.
	 */
	public static registerPlayer(player: Player): void {
		warn("LOADING PLAYER");
		const playerProfile = this.profileStore.LoadProfileAsync(tostring(player.UserId));

		if (playerProfile === undefined) {
			player.Kick(`There was an issue while loading your data. Please rejoin in a few minutes.`);
			return;
		}

		playerProfile.AddUserId(player.UserId);
		playerProfile.Reconcile();

		playerProfile.ListenToRelease(() => {
			this.playerProfiles.delete(player.UserId);

			player.Kick(`There were cross-server conflicts while loading your data. Please rejoin in a few minutes.`);
			return;
		});

		if (!player.IsDescendantOf(Players)) {
			playerProfile.Release();
		}

		const playerStore = new Rodux.Store(storeReducer, playerProfile.Data, [replicationMiddleware(player)]);

		this.playerProfiles.set(player.UserId, playerProfile);
		this.stores.set(player, playerStore);
		remotes.Server.GetNamespace("rodux").Get("storeStateCreated").SendToAllPlayers(player, playerStore.getState());

		warn("Store was created");

		// call creation callbacks
		const callbacks = storeCreationCallbacks.get(player) ?? [];
		for (const callback of callbacks) {
			task.spawn(callback, playerStore);
		}

		storeCreationCallbacks.delete(player);
	}

	/**
	 * Retrieves a player's rodux store.
	 *
	 * @param player The player object.
	 * @returns The player's store.
	 */
	public static retrieveStore(player: Player): Store {
		const store = this.stores.get(player);
		assert(store, `Failed to retrieve rodux store for player ${player.Name}`);

		return store;
	}

	/**
	 * Creates a fake dummy store for a player.
	 *
	 * @param player The fake player to create a dummy store for.
	 * @param initialState The initial state of the store.
	 * @returns The store created and a destructor.
	 */
	public static createDummyStore(
		player: Player,
		initialState: DeepPartial<StoreState>,
	): { store: Store; dispatchedActions: Array<StoreActions>; cleanup: () => void } {
		const { middleware, dispatchedActions } = createSpyMiddleware();

		const store = new Rodux.Store(storeReducer, initialState, [middleware]);
		this.stores.set(player, store);

		return {
			store,
			dispatchedActions,
			// eslint-disable-next-line jsdoc/require-jsdoc
			cleanup: (): void => {
				store.destruct();
				this.stores.delete(player);
			},
		};
	}

	/**
	 * Creates a promise which resolves when the players store has been created.
	 *
	 * @param player The player to listen to the store creation for.
	 * @returns A promise which resolves when the players store has been created.
	 */
	public static onStoreCreated(player: Player): Promise<Store> {
		const store = this.stores.get(player);
		if (store) {
			return Promise.resolve(store);
		}

		// wait until the store has been created
		return new Promise((resolve) => getOrSetDefault(storeCreationCallbacks, player, () => []).push(resolve));
	}

	/**
	 * Saves player data, and runs the release function on their profile.
	 *
	 * @param player The player object.
	 */
	public static removePlayerFromRegistry(player: Player): void {
		const profile = this.playerProfiles.get(player.UserId);
		if (profile === undefined) {
			warn(`Expected to find profile for ${player.Name} with UserId: ${player.UserId}`);
			return;
		}

		profile.Release();

		const store = this.stores.get(player);
		if (!store) {
			throw `No store existed for ${player}`;
		}

		store.destruct();
		this.stores.delete(player);

		// check that no creation callbacks existed for the player
		// if they did, error
		const didDeleteCallbacks = storeCreationCallbacks.delete(player);
		if (didDeleteCallbacks) {
			throw `Removed store creation callbacks from "${player.Name}"`;
		}
	}
}
