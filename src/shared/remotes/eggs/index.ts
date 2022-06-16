import Net from "@rbxts/net";

import { hatchEggDefinition } from "./hatchEgg";
import { toggleAutoHatchDefinition } from "./toggleAuto";

export const eggs = Net.Definitions.Namespace({
	hatchEgg: hatchEggDefinition,
	toggleAuto: toggleAutoHatchDefinition,
});
