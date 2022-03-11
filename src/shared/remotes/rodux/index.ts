import Net from "@rbxts/net";

import { getStoreStateDefinition } from "./getStoreState";
import { storeChangeDefinition } from "./storeChange";

export const roduxDefinitions = Net.Definitions.Namespace({
	storeChange: storeChangeDefinition,
	getStoreState: getStoreStateDefinition,
});
