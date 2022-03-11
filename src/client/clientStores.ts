import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { Store, storeReducer } from "shared/rodux";

export const stores: Map<Player, Store> = new Map();

/**
 * Handles the store creation for a player when they join the game.
 *
 * This involves a network request out to retrieve their state from the server.
 *
 * @param player The player that joined the game.
 */
async function onPlayerAdded(player: Player): Promise<void> {
	const getStoreState = remotes.Client.GetNamespace("rodux").Get("getStoreState");

	const storeState = await getStoreState.CallServerAsync(player);

	const store = new Rodux.Store(storeReducer, storeState);
	stores.set(player, store);
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
