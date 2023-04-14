import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";

import { requestTrade } from "./tradeRequests";
import { acceptTrade } from "./trades";

const tradesNamespace = remotes.Server.GetNamespace("trades");

const requestTradeRemote = tradesNamespace.Create("requestTrade");
const sendTradeRequestRemote = tradesNamespace.Create("sendTradeRequest");
const acceptTradeRequestRemote = tradesNamespace.Create("acceptTradeRequest");
const declineTradeRequestRemote = tradesNamespace.Create("declineTradeRequest");

requestTradeRemote.Connect(
	withPlayerStore((player, store, targetPlayer) => {
		requestTrade(player, store, targetPlayer);

		// alert targetPlayer that a trade request was made
		sendTradeRequestRemote.SendToPlayer(targetPlayer, player);
	}),
);

acceptTradeRequestRemote.Connect((receiver, creator) => {
	acceptTrade(receiver, creator);
});

declineTradeRequestRemote.Connect(() => {
	throw `Not implemeneted`;
});
