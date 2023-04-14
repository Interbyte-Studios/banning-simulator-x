import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";

import { requestTrade } from "./tradeRequests";
import { acceptTrade } from "./trades";

const tradesNamespace = remotes.Server.GetNamespace("trades");

const requestTradeRemote = tradesNamespace.Get("requestTrade");
const sendTradeRequestRemote = tradesNamespace.Get("sendTradeRequest");
const acceptTradeRequestRemote = tradesNamespace.Get("acceptTradeRequest");
const declineTradeRequestRemote = tradesNamespace.Get("declineTradeRequest");

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
