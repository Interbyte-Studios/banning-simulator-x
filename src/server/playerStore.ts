import Rodux from "@rbxts/rodux";
import { createSpyMiddleware } from "shared/mocks/middleware/spyMiddleware";
import { remotes } from "shared/remotes";
import { Store, StoreActions, storeReducer, StoreState } from "shared/rodux";
import { getOrSetDefault } from "shared/util/getOrSetDefault";

import { replicationMiddleware } from "./modules/rodux/middlewares/replicationMiddleware";

/**
 * A collection of all player stores.
 */
export const playerStores = new Map<Player, Store>();

/**
 * Map containing creation callbacks for stores associated with each player.
 */
const storeCreationCallbacks: Map<
	Player,
	Array<{
		resolve: (store: Store) => void;
		reject: () => void;
	}>
> = new Map();

/**
 * A type that allows for partial deep copies of a type.
 */
type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

/**
 * Handles players joining, creating their Rodux store.
 *
 * @param player The player to load data for.
 * @param initialState The initial state of the Rodux store.
 */
export function createPlayerStore(player: Player, initialState: DeepPartial<StoreState>): void {
	const store = new Rodux.Store(storeReducer, initialState, [replicationMiddleware(player)]);
	remotes.Server.GetNamespace("rodux").Get("storeStateCreated").SendToAllPlayers(player, store.getState());
	playerStores.set(player, store);

	// call creation callbacks
	const callbacks = storeCreationCallbacks.get(player) ?? [];
	for (const callback of callbacks) {
		task.spawn(callback.resolve, store);
	}

	storeCreationCallbacks.delete(player);
}

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
 * Removes a player's store from the cache.
 *
 * @param player The player to remove data for.
 */
export function removeStore(player: Player): void {
	const store = playerStores.get(player);
	if (store !== undefined) {
		// a store may be undefined if the createPlayerStore call was never fired.
		// this could be due to long data loading from DataStores, during which the player left.
		// we should not error in such a case.
		store.destruct();
		playerStores.delete(player);

		// check that no creation callbacks existed for the player
		// if they did, reject them all
		const callbacks = storeCreationCallbacks.get(player);
		if (callbacks !== undefined) {
			for (const callback of callbacks) {
				task.spawn(callback.reject);
			}
		}
		storeCreationCallbacks.delete(player);
	}
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
	playerStores.set(player, store);

	return {
		store,
		dispatchedActions,
		// eslint-disable-next-line jsdoc/require-jsdoc
		cleanup: () => removeStore(player),
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
	return new Promise((resolve, reject) =>
		getOrSetDefault(storeCreationCallbacks, player, () => []).push({
			resolve,
			reject,
		}),
	);
}

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
