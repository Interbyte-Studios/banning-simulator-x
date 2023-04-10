import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";

import { requestTrade } from "./tradeRequests";

const requestTradeRemote = remotes.Server.GetNamespace("trades").Create("requestTrade");
const sendTradeRequestRemote = remotes.Server.GetNamespace("trades").Create("sendTradeRequest");

requestTradeRemote.Connect(
	withPlayerStore((player, store, targetPlayer) => {
		requestTrade(player, store, targetPlayer);

		// alert targetPlayer that a trade request was made
		sendTradeRequestRemote.SendToPlayer(targetPlayer);
	}),
);
