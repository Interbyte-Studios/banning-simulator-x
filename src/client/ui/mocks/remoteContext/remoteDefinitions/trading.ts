import { AcceptTradeRequestDefinition } from "shared/remotes/trading/acceptTradeRequest";
import { ConfirmFinalizedTradeDefinition } from "shared/remotes/trading/confirmFinalizedTrade";
import { ConfirmTradeOfferDefinition } from "shared/remotes/trading/confirmOffer";
import { DeclineFinalizedTradeDefinition } from "shared/remotes/trading/declineFinalizedTrade";
import { DeclineTradeOfferDefinition } from "shared/remotes/trading/declineOffer";
import { DeclineTradeRequestDefinition } from "shared/remotes/trading/declineTradeRequest";
import { FinalizedTradeConfirmedDefinition } from "shared/remotes/trading/finalizedTradeConfirmed";
import { FinalizedTradeDeclinedDefinition } from "shared/remotes/trading/finalizedTradeDeclined";
import { ModifyOfferDefinition } from "shared/remotes/trading/modifyOffer";
import { OfferChangedDefinition } from "shared/remotes/trading/offerChanged";
import { TradeOfferConfirmedDefinition } from "shared/remotes/trading/offerConfirmed";
import { TradeOfferDeclinedDefinition } from "shared/remotes/trading/offerDeclined";
import { RequestTradeDefinition } from "shared/remotes/trading/requestTrade";
import { SendTradeRequestDefinition } from "shared/remotes/trading/sendTradeRequest";
import { TradeRequestAcceptedDefinition } from "shared/remotes/trading/tradeRequestAccepted";
import { TradeRequestDeclinedDefinition } from "shared/remotes/trading/tradeRequestDeclined";

import { fakeRemoteCall } from "../fakeRemoteCall";
import { fakeServerToClientRemote } from "../fakeServerToClientRemote";

/**
 *  This is the remote context for the trading remote functions.
 */
export const tradingRemoteContext = {
	// trade requests
	requestTrading: fakeRemoteCall<RequestTradeDefinition>("requestTrading"),
	receiveTradeRequest: fakeServerToClientRemote<SendTradeRequestDefinition>(),

	acceptTradeRequest: fakeRemoteCall<AcceptTradeRequestDefinition>("acceptTradeRequest"),
	declineTradeRequest: fakeRemoteCall<DeclineTradeRequestDefinition>("declineTradeRequest"),

	tradeRequestDeclined: fakeServerToClientRemote<TradeRequestDeclinedDefinition>(),
	tradeRequestAccepted: fakeServerToClientRemote<TradeRequestAcceptedDefinition>(),

	// trade actions
	modifyOffer: fakeRemoteCall<ModifyOfferDefinition>("modifyOffer"),
	offerChanged: fakeServerToClientRemote<OfferChangedDefinition>(),

	// trade confirmation actions
	confirmOffer: fakeRemoteCall<ConfirmTradeOfferDefinition>("confirmOffer"),
	tradeOfferConfirmed: fakeServerToClientRemote<TradeOfferConfirmedDefinition>(),

	declineOffer: fakeRemoteCall<DeclineTradeOfferDefinition>("declineOffer"),
	tradeOfferDeclined: fakeServerToClientRemote<TradeOfferDeclinedDefinition>(),

	confirmFinalizedTrade: fakeRemoteCall<ConfirmFinalizedTradeDefinition>("confirmFinalizedTrade"),
	finalizedTradeConfirmed: fakeServerToClientRemote<FinalizedTradeConfirmedDefinition>(),

	declineFinalizedTrade: fakeRemoteCall<DeclineFinalizedTradeDefinition>("declineFinalizedTrade"),
	finalizedTradeDeclined: fakeServerToClientRemote<FinalizedTradeDeclinedDefinition>(),
};
