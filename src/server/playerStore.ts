import { GameAnalytics } from "@rbxts/gameanalytics";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { STORE_SCOPE } from "shared/configs/game";
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
import { defaultTradeLogs } from "shared/rodux/tradeLogs";
import { defaultWeaponsState } from "shared/rodux/weapons";
import { defaultWorlds } from "shared/rodux/worlds";
import { getOrSetDefault } from "shared/util/getOrSetDefault";

import { replicationMiddleware } from "./modules/rodux/middlewares/replicationMiddleware";
import { savingMiddleware } from "./modules/rodux/middlewares/savingMiddleware";

/**
 * Profile template matches the store state template.
 */
const profileTemplate: StoreState = {
	accolades: defaultAccoladeState,
	bans: defaultBansState,
	boosts: defaultBoosts,
	currencies: defaultCurrencies,
	currentWeapon: defaultCurrentWeaponState,
	currentTalisman: defaultTalismanId,
	devProducts: defaultDevProductState,
	eggs: defaultEggs,
	experience: defaultExperienceState,
	gamepasses: defaultGamepasses,
	index: defaultPlayerIndex,
	media: defaultMediaState,
	pets: defaultPets,
	petMastery: defaultPetMasteryState,
	petTeams: defaultPetTeamsState,
	quests: defaultQuestsState,
	rank: defaultRank,
	settings: defaultSettings,
	spinWheel: defaultSpinWheel,
	talismans: defaultTalismans,
	title: undefined,
	tradeLogs: defaultTradeLogs,
	weapons: defaultWeaponsState,
	worlds: defaultWorlds,
};

/**
 * The data store used to save player data.
 */
const playerDataStore = ProfileService.GetProfileStore(
	{
		Name: "mainstore",
		Scope: STORE_SCOPE,
	},
	profileTemplate,
);

/**
 * A collection of all player stores.
 */
export const playerStores = new Map<Player, Store>();

/**
 * A collection of all player stores.
 */
const profiles = new Map<Player, Profile<StoreState>>();

/**
 * A collection that logs whether or not each players data has loaded.
 */
const dataLoaded = new Map<Player, boolean>();

/**
 * A collection that logs whether or not data is being saved.
 */
const savingData = new Map<Player, boolean>();

/**
 * Map containing creation callbacks for stores associated with each player.
 */
const storeCreationCallbacks: Map<Player, Array<(store: Store) => void>> = new Map();

/**
 * A type that allows for partial deep copies of a type.
 */
type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

/**
 * An upvalue that represents whether or not the game is shutting down.
 */
let shuttingDown = false;

/**
 * Handles players joining, creating their Rodux store.
 *
 * @param player The player to load data for.
 */
const onPlayerAdded = async (player: Player): Promise<void> => {
	if (shuttingDown) {
		player.Kick("The game is being updated. Please rejoin in a few minutes.");
		return;
	}

	const profile = playerDataStore.LoadProfileAsync(tostring(player.UserId));
	if (profile === undefined) {
		player.Kick("Failed to load your data. Please rejoin.");
		return;
	}

	if (!player.IsDescendantOf(Players)) {
		profile.Release();
	}

	profile.AddUserId(player.UserId);
	profile.Reconcile();
	profiles.set(player, profile);

	const store = new Rodux.Store(storeReducer, profile.Data, [
		replicationMiddleware(player),
		savingMiddleware(player, profile),
	]);
	remotes.Server.GetNamespace("rodux").Get("storeStateCreated").SendToAllPlayers(player, store.getState());
	playerStores.set(player, store);

	// call creation callbacks
	const callbacks = storeCreationCallbacks.get(player) ?? [];
	for (const callback of callbacks) {
		task.spawn(callback, store);
	}

	storeCreationCallbacks.delete(player);
	dataLoaded.set(player, true);

	profile.ListenToRelease(() => {
		profiles.delete(player);
		player.Kick(`There was an issue. Please rejoin.`);
	});
};

/**
 * Retrieves a player's rodux store.
 *
 * @param player The player.
 * @returns The store of the player.
 */
export const retrieveStore = (player: Player): Store => {
	const store = playerStores.get(player);
	if (store === undefined) {
		throw `[PlayerDataStore - retrieveStore] Failed to retrieve rodux store for player ${player.Name}`;
	}

	return store;
};

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
	playerStores.set(player, store);

	return {
		store,
		dispatchedActions,
		// eslint-disable-next-line jsdoc/require-jsdoc
		cleanup: (): void => {
			store.destruct();
			playerStores.delete(player);
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
	const store = playerStores.get(player);
	if (store) {
		return Promise.resolve(store);
	}

	// wait until the store has been created
	return new Promise((resolve) => getOrSetDefault(storeCreationCallbacks, player, () => []).push(resolve));
}

/**
 * Iterates over all players already in the game and creates a store for them.
 */
Players.GetPlayers().forEach(async (player) => {
	await onPlayerAdded(player);
});

/**
 * The PlayerAdded event which creates a store for the player.
 */
Players.PlayerAdded.Connect(async (player) => {
	await onPlayerAdded(player);
});

/**
 * The PlayerRemoving event which saves the player's data.
 */
Players.PlayerRemoving.Connect((player) => {
	if (shuttingDown) {
		return;
	}

	if (dataLoaded.get(player) === undefined) {
		return;
	}

	if (savingData.get(player) !== undefined) {
		return;
	}
	savingData.set(player, true);

	const profile = profiles.get(player);
	if (profile === undefined) {
		GameAnalytics.addErrorEvent(player.UserId, {
			severity: "error",
			message: `[PlayerDataStore - PlayerRemoving] Failed to retrieve profile for player`,
		});

		playerStores.delete(player);
		dataLoaded.delete(player);
		savingData.delete(player);

		throw `[PlayerDataStore - PlayerRemoving] Failed to retrieve profile for player ${player.Name}`;
	}

	const store = playerStores.get(player);
	if (store !== undefined) {
		profile.Release();
		profiles.delete(player);

		store.destruct();
		playerStores.delete(player);

		dataLoaded.delete(player);
		savingData.delete(player);

		// check that no creation callbacks existed for the player
		// if they did, error
		const didDeleteCallbacks = storeCreationCallbacks.delete(player);
		if (didDeleteCallbacks) {
			throw `Removed store creation callbacks from "${player.Name}"`;
		}
	} else {
		GameAnalytics.addErrorEvent(player.UserId, {
			severity: "error",
			message: `[PlayerDataStore - PlayerRemoving] Failed to retrieve rodux store for player`,
		});

		playerStores.delete(player);
		dataLoaded.delete(player);
		savingData.delete(player);

		throw `[PlayerDataStore - PlayerRemoving] Failed to retrieve rodux store for player ${player.Name}`;
	}
});

remotes.Server.GetNamespace("rodux")
	.Get("requestStoreState")
	.SetCallback((player: Player, targetPlayer: Player) => {
		const store = playerStores.get(targetPlayer);
		if (store === undefined) {
			warn(`[PlayerDataStore - requestStoreState] Failed to retrieve rodux store for player ${targetPlayer.Name}`);
			return undefined;
		}

		return {
			state: store.getState(),
		};
	});

/**
 * The BindToClose event which saves all player data and kicks all players (soft shutdown implementation).
 */
game.BindToClose(() => {
	shuttingDown = true;

	for (const player of Players.GetPlayers()) {
		if (dataLoaded.get(player) !== undefined && savingData.get(player) === undefined) {
			const profile = profiles.get(player);
			if (profile === undefined) {
				GameAnalytics.addErrorEvent(player.UserId, {
					severity: "error",
					message: `[PlayerDataStore - PlayerRemoving] Failed to retrieve profile for player`,
				});
			} else {
				profile.Release();
			}
		}

		player.Kick("The game is being updated. Please rejoin in a few minutes.");
	}
});
