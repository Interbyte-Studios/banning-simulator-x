import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("trades");

/**
 * Remotes for trading.
 */
export const tradingRemotes = {
	requestTrading: remoteNamespace.Get("requestTrade"),
	receiveTradeRequest: remoteNamespace.Get("sendTradeRequest"),
	acceptTradeRequest: remoteNamespace.Get("acceptTradeRequest"),
	declineTradeRequest: remoteNamespace.Get("declineTradeRequest"),
	tradeRequestDeclined: remoteNamespace.Get("tradeRequestDeclined"),
	tradeRequestAccepted: remoteNamespace.Get("tradeRequestAccepted"),
	modifyOffer: remoteNamespace.Get("modifyOffer"),
	offerChanged: remoteNamespace.Get("offerChanged"),
};
