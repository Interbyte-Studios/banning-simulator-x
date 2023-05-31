import { Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { TRADING_ATTRIBUTE } from "shared/trading/tradingAttributes";

import { requestTrade } from "./tradeRequests";
import {
	acceptTrade,
	confirmFinalizedTradeOffer,
	confirmTradeOffer,
	declineFinalizedTradeOffer,
	declineTradeOffer,
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
const tradeRequestAccepted = tradesNamespace.Get("tradeRequestAccepted");
acceptTradeRequestRemote.Connect((receiver, creator) => {
	acceptTrade(receiver, creator);

	// alert creator that the trade request was accepted
	tradeRequestAccepted.SendToPlayer(creator, receiver);
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
		if (getTradeStatus(player) !== TradeStatus.Trading && getTradeStatus(player) !== TradeStatus.ConfirmedOffer) {
			return warn("Not in a trade");
		}

		if (!modifyTrade(player, store, offer)) {
			// failed to modify trade
			// we should tell the player to not modify
			print("Issue with modified trade. Not finalizing the modification.");
			return offerChanged.SendToPlayer(player, player, getTradeItems(player));
		}

		// alert the other player that the offer changed
		print("Offer was changed. Alerting other player.");
		offerChanged.SendToPlayer(getTradingCounterParty(player), player, offer);
	}),
);

const confirmOffer = tradesNamespace.Get("confirmTradeOffer");
const offerConfirmed = tradesNamespace.Get("tradeOfferConfirmed");
confirmOffer.Connect((player) => {
	// first, ensure a player is in a trade
	if (getTradeStatus(player) !== TradeStatus.Trading) {
		return;
	}

	// confirm the trade
	if (!confirmTradeOffer(player)) {
		// failed to confirm trade
		// we should tell the player to not confirm
		print("Issue with confirming trade. Not finalizing the trade.");
		return offerConfirmed.SendToPlayer(player, player, getTradeItems(player));
	}

	// alert the other player that the offer was confirmed
	print("Offer was confirmed. Alerting other player.");
	offerConfirmed.SendToPlayer(getTradingCounterParty(player), player, getTradeItems(player));
});

const declineOffer = tradesNamespace.Get("declineTradeOffer");
const offerDeclined = tradesNamespace.Get("tradeOfferDeclined");
declineOffer.Connect((player) => {
	// first, ensure a player is in a trade
	if (getTradeStatus(player) !== TradeStatus.Trading && getTradeStatus(player) !== TradeStatus.ConfirmedOffer) {
		return warn(`Player ${player.Name} attempted to decline a trade offer, but they are not in a trade`);
	}

	const otherPlayer = getTradingCounterParty(player);
	if (declineTradeOffer(player)) {
		// alert the other player that the trade got declined
		offerDeclined.SendToPlayer(otherPlayer, player);

		player.SetAttribute(TRADING_ATTRIBUTE, undefined);
		otherPlayer.SetAttribute(TRADING_ATTRIBUTE, undefined);
	}
});

const confirmFinalizedTrade = tradesNamespace.Get("confirmFinalizedTrade");
const finalizedTradeConfirmed = tradesNamespace.Get("finalizedTradeConfirmed");
confirmFinalizedTrade.Connect(
	withPlayerStore((player, store) => {
		// first, ensure a player is in a trade
		if (getTradeStatus(player) !== TradeStatus.ViewingFinalizedTrade) {
			return warn("Not viewing finalized trade, cannot confirm finalized trade");
		}

		// confirm the trade
		if (!confirmFinalizedTradeOffer(player, store)) {
			// failed to confirm trade
			// we should tell the player to not confirm
			print("Issue with confirming trade. Not finalizing the trade.");
			return finalizedTradeConfirmed.SendToPlayer(player, player, getTradeItems(player));
		}

		// alert the other player that the offer was confirmed
		print("Offer was confirmed. Alerting other player.");
		finalizedTradeConfirmed.SendToPlayer(getTradingCounterParty(player), player, getTradeItems(player));

		if (getTradeStatus(getTradingCounterParty(player)) === TradeStatus.Finalized) {
			player.SetAttribute(TRADING_ATTRIBUTE, undefined);
			getTradingCounterParty(player).SetAttribute(TRADING_ATTRIBUTE, undefined);

			removeTrade(player);
		}
	}),
);

const declineFinalizedTrade = tradesNamespace.Get("declineFinalizedTrade");
const finalizedTradeDeclined = tradesNamespace.Get("finalizedTradeDeclined");
declineFinalizedTrade.Connect((player) => {
	if (declineFinalizedTradeOffer(player)) {
		finalizedTradeDeclined.SendToPlayer(getTradingCounterParty(player), player, getTradeItems(player));
	}
});

const clientTradeError = tradesNamespace.Get("clientTradeError");
const abandonTradeAssertion = tradesNamespace.Get("abandonTradeAssertion");
clientTradeError.Connect((player) => {
	player.SetAttribute(TRADING_ATTRIBUTE, undefined);
	getTradingCounterParty(player).SetAttribute(TRADING_ATTRIBUTE, undefined);

	abandonTradeAssertion.SendToPlayer(getTradingCounterParty(player));

	removeTrade(player);
});

Players.PlayerRemoving.Connect((player) => {
	// remove a trade if it exists
	const traders = removeTrade(player);
	for (const trader of traders) {
		trader.SetAttribute(TRADING_ATTRIBUTE, undefined);

		if (trader !== player) {
			abandonTradeAssertion.SendToPlayer(trader);
		}
	}
});
