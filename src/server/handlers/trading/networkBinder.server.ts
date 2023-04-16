import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { TRADING_ATTRIBUTE } from "shared/trading/tradingAttributes";

import { requestTrade } from "./tradeRequests";
import { acceptTrade, rejectTrade } from "./trades";

const tradesNamespace = remotes.Server.GetNamespace("trades");

const requestTradeRemote = tradesNamespace.Get("requestTrade");
const sendTradeRequestRemote = tradesNamespace.Get("sendTradeRequest");
requestTradeRemote.Connect(
	withPlayerStore((player, store, targetPlayer) => {
		requestTrade(player, store, targetPlayer);

		// alert targetPlayer that a trade request was made
		sendTradeRequestRemote.SendToPlayer(targetPlayer, player);
	}),
);

const acceptTradeRequestRemote = tradesNamespace.Get("acceptTradeRequest");
acceptTradeRequestRemote.Connect((receiver, creator) => {
	acceptTrade(receiver, creator);

	// todo: alert creator that the trade request was accepted
});

const declineTradeRequest = tradesNamespace.Get("declineTradeRequest");
const tradeRequestDeclined = tradesNamespace.Get("tradeRequestDeclined");
declineTradeRequest.Connect((receiver, creator) => {
	if (rejectTrade(receiver, creator)) {
		// alert `creator` that the trade got cancelled
		tradeRequestDeclined.SendToPlayer(creator);

		receiver.SetAttribute(TRADING_ATTRIBUTE, undefined);
		creator.SetAttribute(TRADING_ATTRIBUTE, undefined);
	}
});
