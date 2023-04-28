import Net from "@rbxts/net";

import { requestStoreStateDefinition } from "./requestStoreState";
import { storeChangeDefinition } from "./storeChange";
import { storeStateCreatedDefinition } from "./storeStateCreated";

export const roduxDefinitions = Net.Definitions.Namespace({
	storeChange: storeChangeDefinition,
	storeStateCreated: storeStateCreatedDefinition,
	requestStoreState: requestStoreStateDefinition,
});
