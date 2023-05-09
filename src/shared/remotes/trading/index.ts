import Net from "@rbxts/net";

import { acceptTradeRequestDefinition } from "./acceptTradeRequest";
import { declineTradeRequestDefinition } from "./declineTradeRequest";
import { modifyOfferDefinition } from "./modifyOffer";
import { offerChangedDefinition } from "./offerChanged";
import { requestTradeDefinition } from "./requestTrade";
import { sendTradeRequestDefinition } from "./sendTradeRequest";
import { tradeRequestAcceptedDefinition } from "./tradeRequestAccepted";
import { tradeRequestDeclinedDefinition } from "./tradeRequestDeclined";

export const trading = Net.Definitions.Namespace({
	requestTrade: requestTradeDefinition,
	sendTradeRequest: sendTradeRequestDefinition,

	acceptTradeRequest: acceptTradeRequestDefinition,
	declineTradeRequest: declineTradeRequestDefinition,

	tradeRequestDeclined: tradeRequestDeclinedDefinition,
	tradeRequestAccepted: tradeRequestAcceptedDefinition,

	modifyOffer: modifyOfferDefinition,
	offerChanged: offerChangedDefinition,
});
