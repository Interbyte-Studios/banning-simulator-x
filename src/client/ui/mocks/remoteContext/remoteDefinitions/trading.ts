import { AcceptTradeRequestDefinition } from "shared/remotes/trading/acceptTradeRequest";
import { DeclineTradeRequestDefinition } from "shared/remotes/trading/declineTradeRequest";
import { ModifyOfferDefinition } from "shared/remotes/trading/modifyOffer";
import { OfferChangedDefinition } from "shared/remotes/trading/offerChanged";
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
	requestTrading: fakeRemoteCall<RequestTradeDefinition>("requestTrading"),
	receiveTradeRequest: fakeServerToClientRemote<SendTradeRequestDefinition>(),
	acceptTradeRequest: fakeRemoteCall<AcceptTradeRequestDefinition>("acceptTradeRequest"),
	declineTradeRequest: fakeRemoteCall<DeclineTradeRequestDefinition>("declineTradeRequest"),
	tradeRequestDeclined: fakeServerToClientRemote<TradeRequestDeclinedDefinition>(),
	tradeRequestAccepted: fakeServerToClientRemote<TradeRequestAcceptedDefinition>(),
	modifyOffer: fakeRemoteCall<ModifyOfferDefinition>("modifyOffer"),
	offerChanged: fakeServerToClientRemote<OfferChangedDefinition>(),
};
