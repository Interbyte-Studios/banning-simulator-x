import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { createSpyMiddleware } from "shared/mocks/middleware/spyMiddleware";
import { remotes } from "shared/remotes";
import { Store, StoreActions, storeReducer, StoreState } from "shared/rodux";
import { getOrSetDefault } from "shared/util/getOrSetDefault";

import { replicationMiddleware } from "./modules/rodux/middlewares/replicationMiddleware";

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

export const stores: Map<Player, Store> = new Map();
const storeCreationCallbacks: Map<Player, Array<(store: Store) => void>> = new Map();

/**
 * Handles players joining, creating their Rodux store.
 *
 * @param player The player that is joining.
 */
function onPlayerAdded(player: Player): void {
	const store = new Rodux.Store(storeReducer, {}, [replicationMiddleware(player)]);

	stores.set(player, store);

	// call creation callbacks
	const callbacks = storeCreationCallbacks.get(player) ?? [];
	for (const callback of callbacks) {
		task.spawn(callback, store);
	}

	storeCreationCallbacks.delete(player);
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

	store.destruct();
	stores.delete(player);

	// check that no creation callbacks existed for the player
	// if they did, error
	const didDeleteCallbacks = storeCreationCallbacks.delete(player);
	if (didDeleteCallbacks) {
		throw `Removed store creation callbacks from "${player.Name}"`;
	}
}

// connect to getStoreState event
remotes.Server.GetNamespace("rodux")
	.Create("getStoreState")
	.SetCallback(async (_, player) => {
		const storeState = stores.get(player);

		return storeState?.getState();
	});

Players.PlayerAdded.Connect(onPlayerAdded);
Players.GetPlayers().forEach(onPlayerAdded);

Players.PlayerRemoving.Connect(onPlayerRemoving);
