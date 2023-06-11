import Rodux from "@rbxts/rodux";
import { Players, RunService } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { Store, storeReducer } from "shared/rodux";
import { getOrSetDefault } from "shared/util/getOrSetDefault";

export const stores: Map<Player, Store> = new Map();
const storeCreationCallbacks: Map<Player, Array<(store: Store) => void>> = new Map();

/**
 * Creates a promise which resolves once a store for a player has been retrieved.
 *
 * @param player The player to wait for the store to be created for.
 * @returns A promise which resolves when the store has been retrieved.
 */
export function onStoreCreated(player: Player): Promise<Store> {
	const store = stores.get(player);
	if (store) {
		return Promise.resolve(store);
	}

	// wait until the store has been created
	return new Promise((resolve) => {
		getOrSetDefault(storeCreationCallbacks, player, () => []).push(resolve);
	});
}

/**
 * Retrieves the store of the specified player if it exists.
 *
 * @param player The player object.
 * @returns The store of the player.
 */
export function retrieveStore(player: Player): Store | undefined {
	const store = stores.get(player);
	if (store === undefined && RunService.IsStudio()) {
		return undefined;
	}
	assert(store, `Expected client store to exist for player ${player.Name}.`);

	return store;
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

remotes.Client.GetNamespace("rodux")
	.Get("storeStateCreated")
	.Connect((player, state) => {
		const store = new Rodux.Store(storeReducer, state);
		stores.set(player, store);

		// call creation callbacks
		const callbacks = storeCreationCallbacks.get(player) ?? [];
		for (const callback of callbacks) {
			task.spawn(callback, store);
		}

		storeCreationCallbacks.delete(player);
	});

Players.GetPlayers().forEach(async (player) => {
	const storeState = await remotes.Client.GetNamespace("rodux").Get("requestStoreState").CallServerAsync(player);
	if (storeState === undefined) {
		// server did not have a store for the player when we requested in
		// this likely needs some investigation to solve
		throw `Failed to retrieve server state for ${player.Name}`;
	}

	if (stores.get(player)) {
		return;
	}

	const store = new Rodux.Store(storeReducer, storeState.state);
	stores.set(player, store);

	// call creation callbacks
	const callbacks = storeCreationCallbacks.get(player) ?? [];
	for (const callback of callbacks) {
		task.spawn(callback, store);
	}

	storeCreationCallbacks.delete(player);
});

Players.PlayerRemoving.Connect(onPlayerRemoving);
