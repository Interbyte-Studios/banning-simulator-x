import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { createSpyMiddleware } from "shared/mocks/middleware/spyMiddleware";
import { remotes } from "shared/remotes";
import { Store, StoreActions, storeReducer, StoreState } from "shared/rodux";
import { defaultAccoladeState } from "shared/rodux/accolade";
import { defaultBansState } from "shared/rodux/bans";
import { defaultBoosts } from "shared/rodux/boosts";
import { defaultCurrencies } from "shared/rodux/currencies";
import { defaultTalismanId } from "shared/rodux/currentTalisman";
import { defaultCurrentWeaponState } from "shared/rodux/currentWeapon";
import { defaultDevProductState } from "shared/rodux/devProducts";
import { defaultEggs } from "shared/rodux/eggs";
import { defaultExperienceState } from "shared/rodux/experience";
import { defaultGamepasses } from "shared/rodux/gamepasses";
import { defaultMediaState } from "shared/rodux/media";
import { defaultPetMasteryState } from "shared/rodux/petMastery";
import { defaultPets } from "shared/rodux/pets";
import { defaultPetTeamsState } from "shared/rodux/petTeams";
import { defaultPlayerIndex } from "shared/rodux/playerIndex";
import { defaultQuestsState } from "shared/rodux/quests";
import { defaultRank } from "shared/rodux/rank";
import { defaultSettings } from "shared/rodux/settings";
import { defaultSpinWheel } from "shared/rodux/spinWheel";
import { defaultTalismans } from "shared/rodux/talismans";
import { defaultWeaponsState } from "shared/rodux/weapons";
import { defaultWorlds } from "shared/rodux/worlds";
import { getOrSetDefault } from "shared/util/getOrSetDefault";

import { replicationMiddleware } from "./modules/rodux/middlewares/replicationMiddleware";

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

/**
 * Template object representing the initial state for a player's profile.
 * Each property corresponds to a specific slice of the store's state.
 * Default values are assigned to each property based on their respective default state objects/constants.
 */
const profileTemplate: StoreState = {
	accolades: defaultAccoladeState,
	bans: defaultBansState,
	boosts: defaultBoosts,
	currencies: defaultCurrencies,
	currentWeapon: defaultCurrentWeaponState,
	eggs: defaultEggs,
	experience: defaultExperienceState,
	gamepasses: defaultGamepasses,
	media: defaultMediaState,
	pets: defaultPets,
	quests: defaultQuestsState,
	rank: defaultRank,
	settings: defaultSettings,
	title: undefined,
	weapons: defaultWeaponsState,
	worlds: defaultWorlds,
	talismans: defaultTalismans,
	currentTalisman: defaultTalismanId,
	petMastery: defaultPetMasteryState,
	spinWheel: defaultSpinWheel,
	petTeams: defaultPetTeamsState,
	index: defaultPlayerIndex,
	devProducts: defaultDevProductState,
};

/**
 * The ProfileService profile store.
 */
const profileStore = ProfileService.GetProfileStore("testStore", profileTemplate);

/**
 * A collection of all player profiles.
 */
const playerProfiles: Map<number, Profile<StoreState>> = new Map();

/**
 * Collection of rodux stores.
 */
export const stores: Map<Player, Store> = new Map();

/**
 * Map containing creation callbacks for stores associated with each player.
 */
const storeCreationCallbacks: Map<Player, Array<(store: Store) => void>> = new Map();

/**
 * Handles players joining, creating their Rodux store.
 *
 * @param player The player that is joining.
 */
function onPlayerAdded(player: Player): void {
	const playerProfile = profileStore.LoadProfileAsync(tostring(player.UserId));

	if (playerProfile === undefined) {
		player.Kick(`There was an issue while loading your data. Please rejoin in a few minutes.`);
		return;
	}

	playerProfile.AddUserId(player.UserId);
	playerProfile.Reconcile();

	playerProfile.ListenToRelease(() => {
		playerProfiles.delete(player.UserId);

		player.Kick(`There were cross-server conflicts while loading your data. Please rejoin in a few minutes.`);
		return;
	});

	if (!player.IsDescendantOf(Players)) {
		playerProfile.Release();
	}

	const playerStore = new Rodux.Store(storeReducer, playerProfile.Data, [replicationMiddleware(player)]);

	playerProfiles.set(player.UserId, playerProfile);
	stores.set(player, playerStore);
	remotes.Server.GetNamespace("rodux").Get("storeStateCreated").SendToAllPlayers(player, playerStore.getState());

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
 * @param player The player.
 * @returns The store of the player.
 */
export function retrieveStore(player: Player): Store {
	const store = stores.get(player);
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
export function createDummyStore(
	player: Player,
	initialState: DeepPartial<StoreState>,
): { store: Store; dispatchedActions: Array<StoreActions>; cleanup: () => void } {
	const { middleware, dispatchedActions } = createSpyMiddleware();

	const store = new Rodux.Store(storeReducer, initialState, [middleware]);
	stores.set(player, store);

	return {
		store,
		dispatchedActions,
		// eslint-disable-next-line jsdoc/require-jsdoc
		cleanup: (): void => {
			store.destruct();
			stores.delete(player);
		},
	};
}

/**
 * Creates a promise which resolves when the players store has been created.
 *
 * @param player The player to listen to the store creation for.
 * @returns A promise which resolves when the players store has been created.
 */
export function onStoreCreated(player: Player): Promise<Store> {
	const store = stores.get(player);
	if (store) {
		return Promise.resolve(store);
	}

	// wait until the store has been created
	return new Promise((resolve) => getOrSetDefault(storeCreationCallbacks, player, () => []).push(resolve));
}

/**
 * Handles players leaving, destructing their Rodux store.
 *
 * @param player The player that is leaving.
 */
function onPlayerRemoving(player: Player): void {
	const store = stores.get(player);
	if (!store) {
		throw `No store existed for ${player}`;
	}

	const profile = playerProfiles.get(player.UserId);
	if (profile === undefined) {
		throw `No profile existed for ${player}`;
	}

	profile.Data = store.getState();
	profile.Release();

	store.destruct();
	stores.delete(player);

	// check that no creation callbacks existed for the player
	// if they did, error
	const didDeleteCallbacks = storeCreationCallbacks.delete(player);
	if (didDeleteCallbacks) {
		throw `Removed store creation callbacks from "${player.Name}"`;
	}
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.GetPlayers().forEach(onPlayerAdded);

Players.PlayerRemoving.Connect(onPlayerRemoving);

remotes.Server.GetNamespace("rodux")
	.Get("requestStoreState")
	.SetCallback((player: Player) => {
		const store = stores.get(player);
		if (store === undefined) {
			return undefined;
		}

		return {
			state: store.getState(),
		};
	});
