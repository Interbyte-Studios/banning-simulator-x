import Rodux from "@rbxts/rodux";
import { remotes } from "shared/remotes";
import { StoreActions } from "shared/rodux";

/**
 * Creates some replication middleware for a player such that all actions dispatched will be sent over the network to all players.
 *
 * @param player The player that the replication middleware should be wrapped for.
 * @returns The Rodux middleware to apply.
 */
export const replicationMiddleware = (player: Player): Rodux.Middleware => {
	const storeChangeEvent = remotes.Server.GetNamespace("rodux").Create("storeChange");

	return (nextDispatch: Rodux.Dispatch<StoreActions>) => {
		return (action: StoreActions): void => {
			nextDispatch(action);

			storeChangeEvent.SendToAllPlayers(player, action);
		};
	};
};
