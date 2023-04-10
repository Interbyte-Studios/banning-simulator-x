import Net from "@rbxts/net";

import { acceptTradeRequestDefinition } from "./acceptTradeRequest";
import { requestTradeDefinition } from "./requestTrade";
import { sendTradeRequestDefinition } from "./sendTradeRequest";

export const trading = Net.Definitions.Namespace({
	requestTrade: requestTradeDefinition,
	sendTradeRequest: sendTradeRequestDefinition,

	acceptTradeRequest: acceptTradeRequestDefinition,
});
