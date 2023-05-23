import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("trades");

/**
 * Remotes for trading.
 */
export const tradingRemotes = {
	// trade requests
	requestTrading: remoteNamespace.Get("requestTrade"),
	receiveTradeRequest: remoteNamespace.Get("sendTradeRequest"),

	acceptTradeRequest: remoteNamespace.Get("acceptTradeRequest"),
	declineTradeRequest: remoteNamespace.Get("declineTradeRequest"),

	tradeRequestDeclined: remoteNamespace.Get("tradeRequestDeclined"),
	tradeRequestAccepted: remoteNamespace.Get("tradeRequestAccepted"),

	// trade actions
	modifyOffer: remoteNamespace.Get("modifyOffer"),
	offerChanged: remoteNamespace.Get("offerChanged"),
	retrieveOffer: remoteNamespace.Get("retrieveOffer"),

	// confirmation actions
	confirmOffer: remoteNamespace.Get("confirmTradeOffer"),
	tradeOfferConfirmed: remoteNamespace.Get("tradeOfferConfirmed"),

	declineOffer: remoteNamespace.Get("declineTradeOffer"),
	tradeOfferDeclined: remoteNamespace.Get("tradeOfferDeclined"),

	confirmFinalizedTrade: remoteNamespace.Get("confirmFinalizedTrade"),
	finalizedTradeConfirmed: remoteNamespace.Get("finalizedTradeConfirmed"),

	declineFinalizedTrade: remoteNamespace.Get("declineFinalizedTrade"),
	finalizedTradeDeclined: remoteNamespace.Get("finalizedTradeDeclined"),

	// error handling
	clientTradeError: remoteNamespace.Get("clientTradeError"),
	abandonTradeAssertion: remoteNamespace.Get("abandonTradeAssertion"),
};
