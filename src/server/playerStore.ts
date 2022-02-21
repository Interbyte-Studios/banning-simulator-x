import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { Store, storeReducer } from "shared/rodux";

import { replicationMiddleware } from "./modules/rodux/replicationMiddleware";

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
