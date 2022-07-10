import Net from "@rbxts/net";

import { hatchEggDefinition } from "./hatchEgg";

export const eggs = Net.Definitions.Namespace({
	hatchEgg: hatchEggDefinition,
});
