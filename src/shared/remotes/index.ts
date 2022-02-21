import Net from "@rbxts/net";

import { storeChangeDefinition } from "./rodux";

export const remotes = Net.Definitions.Create({
	storeChange: storeChangeDefinition,
});
