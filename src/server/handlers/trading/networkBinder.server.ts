import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";

import { requestTrade } from "./tradeRequests";

remotes.Server.GetNamespace("trades")
	.Create("requestTrade")
	.Connect(
		withPlayerStore((player, store, targetPlayer) => {
			requestTrade(player, store, targetPlayer);

			const sendTradeRequestRemote = remotes.Server.GetNamespace("trades").Create("sendTradeRequest");

			// alert targetPlayer that a trade request was made
			sendTradeRequestRemote.SendToPlayer(targetPlayer);
		}),
	);
