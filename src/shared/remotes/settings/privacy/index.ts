import Net from "@rbxts/net";

import { togglePublicInventoryDefinition } from "./publicInventory";
import { togglePublicTradeHistoryDefinition } from "./publicTradeHistory";
import { toggleTradesEnabledDefinition } from "./tradesEnabled";

export const privacy = Net.Definitions.Namespace({
	publicInventory: togglePublicInventoryDefinition,
	publicTradeHistory: togglePublicTradeHistoryDefinition,
	tradesEnabled: toggleTradesEnabledDefinition,
});
