import { GameAnalytics } from "@rbxts/gameanalytics";
import Rodux from "@rbxts/rodux";
import { DataStoreService, Players } from "@rbxts/services";
import { STORE_SCOPE } from "shared/configs/game";
import { createSpyMiddleware } from "shared/mocks/middleware/spyMiddleware";
import { remotes } from "shared/remotes";
import { Store, StoreActions, storeReducer, StoreState } from "shared/rodux";
import { getOrSetDefault } from "shared/util/getOrSetDefault";

import { replicationMiddleware } from "./modules/rodux/middlewares/replicationMiddleware";

/**
 * The data store used to save player data.
 */
const playerDataStore = DataStoreService.GetDataStore("mainstore", STORE_SCOPE);

/**
 * A collection of all player stores.
 */
export const playerStores = new Map<Player, Store>();

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
 * Loads a player's profile from the data store.
 *
 * @param player The player to load data for.
 * @param data The data to load into the player's profile.
 */
const savePlayerData = (player: Player, data: StoreState): void => {
	const [success, err] = pcall(() => {
		playerDataStore.SetAsync(tostring(player.UserId), data);
	});

	if (!success) {
		throw `[PlayerDataStore - savePlayerData] Player: ${player.Name} | Error: ${err}`;
	}
};

/**
 * Loads a player's profile from the data store.
 *
 * @param player The player to load data for.
 * @returns The player's profile data.
 */
const loadPlayerData = (player: Player): StoreState | undefined => {
	const [success, data] = pcall(() => {
		return playerDataStore.GetAsync(tostring(player.UserId));
	});

	if (!success) {
		throw `[PlayerDataStore - loadPlayerData] Player: ${player.Name} | Error: ${data}`;
	}

	return data as StoreState;
};

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

	const data = loadPlayerData(player);

	const store = new Rodux.Store(storeReducer, data ?? undefined, [replicationMiddleware(player)]);
	remotes.Server.GetNamespace("rodux").Get("storeStateCreated").SendToAllPlayers(player, store.getState());
	playerStores.set(player, store);

	// call creation callbacks
	const callbacks = storeCreationCallbacks.get(player) ?? [];
	for (const callback of callbacks) {
		task.spawn(callback, store);
	}

	storeCreationCallbacks.delete(player);

	dataLoaded.set(player, true);
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

	const store = playerStores.get(player);
	if (store !== undefined) {
		const state = store.getState() as StoreState;
		savePlayerData(player, state);

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
	.SetCallback((player: Player) => {
		const store = playerStores.get(player);
		if (store === undefined) {
			warn(`[PlayerDataStore - requestStoreState] Failed to retrieve rodux store for player ${player.Name}`);
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
			const store = playerStores.get(player);
			if (store !== undefined) {
				const state = store.getState() as StoreState;
				savePlayerData(player, state);
			} else {
				GameAnalytics.addErrorEvent(player.UserId, {
					severity: "error",
					message: `[PlayerDataStore - BindToClose] Failed to retrieve rodux store for player`,
				});
			}
		}

		player.Kick("The game is being updated. Please rejoin in a few minutes.");
	}
});
