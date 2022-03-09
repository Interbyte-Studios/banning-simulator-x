import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { createSpyMiddleware } from "shared/mocks/middleware/spyMiddleware";
import { Store, StoreActions, storeReducer, StoreState } from "shared/rodux";

import { replicationMiddleware } from "./modules/rodux/middlewares/replicationMiddleware";

type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> };

export const stores: Map<Player, Store> = new Map();

/**
 * Handles players joining, creating their Rodux store.
 *
 * @param player The player that is joining.
 */
function onPlayerAdded(player: Player): void {
	const store = new Rodux.Store(storeReducer, {}, [replicationMiddleware(player)]);

	stores.set(player, store);
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
		cleanup: () => {
			store.destruct();
			stores.delete(player);
		},
	};
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
}

Players.PlayerAdded.Connect(onPlayerAdded);
Players.GetPlayers().forEach(onPlayerAdded);

Players.PlayerRemoving.Connect(onPlayerRemoving);
