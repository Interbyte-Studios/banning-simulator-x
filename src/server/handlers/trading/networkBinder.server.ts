import { Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { TRADING_ATTRIBUTE } from "shared/trading/tradingAttributes";

import { requestTrade } from "./tradeRequests";
import {
	acceptTrade,
	getTradeItems,
	getTradeStatus,
	getTradingCounterParty,
	modifyTrade,
	rejectTrade,
	removeTrade,
	TradeStatus,
} from "./trades";

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
		tradeRequestDeclined.SendToPlayer(creator, receiver);

		receiver.SetAttribute(TRADING_ATTRIBUTE, undefined);
		creator.SetAttribute(TRADING_ATTRIBUTE, undefined);
	}
});

const modifyOffer = tradesNamespace.Get("modifyOffer");
const offerChanged = tradesNamespace.Get("offerChanged");
modifyOffer.Connect(
	withPlayerStore((player, store, offer) => {
		// first, ensure a player is in a trade
		if (getTradeStatus(player) !== TradeStatus.Trading) {
			return;
		}

		if (!modifyTrade(player, store, offer)) {
			// failed to modify trade
			// we should tell the player to not modify
			return offerChanged.SendToPlayer(player, player, getTradeItems(player));
		}

		// alert the other player that the offer changed
		offerChanged.SendToPlayer(getTradingCounterParty(player), player, offer);
	}),
);

Players.PlayerRemoving.Connect((player) => {
	// remove a trade if it exists
	const traders = removeTrade(player);
	for (const trader of traders) {
		trader.SetAttribute(TRADING_ATTRIBUTE, undefined);
	}
});
