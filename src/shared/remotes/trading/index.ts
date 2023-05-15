import Net from "@rbxts/net";

import { acceptTradeRequestDefinition } from "./acceptTradeRequest";
import { confirmFinalizedTradeDefinition } from "./confirmFinalizedTrade";
import { confirmTradeOfferDefinition } from "./confirmOffer";
import { declineFinalizedTradeDefinition } from "./declineFinalizedTrade";
import { declineTradeOfferDefinition } from "./declineOffer";
import { declineTradeRequestDefinition } from "./declineTradeRequest";
import { finalizedTradeConfirmedDefinition } from "./finalizedTradeConfirmed";
import { finalizedTradeDeclinedDefinition } from "./finalizedTradeDeclined";
import { modifyOfferDefinition } from "./modifyOffer";
import { offerChangedDefinition } from "./offerChanged";
import { tradeOfferConfirmedDefinition } from "./offerConfirmed";
import { tradeOfferDeclinedDefinition } from "./offerDeclined";
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

	confirmTradeOffer: confirmTradeOfferDefinition,
	tradeOfferConfirmed: tradeOfferConfirmedDefinition,
	declineTradeOffer: declineTradeOfferDefinition,
	tradeOfferDeclined: tradeOfferDeclinedDefinition,

	confirmFinalizedTrade: confirmFinalizedTradeDefinition,
	finalizedTradeConfirmed: finalizedTradeConfirmedDefinition,
	declineFinalizedTrade: declineFinalizedTradeDefinition,
	finalizedTradeDeclined: finalizedTradeDeclinedDefinition,
});
