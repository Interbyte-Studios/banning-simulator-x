import Net from "@rbxts/net";

import { toggleAutoHatchDefinition } from "../settings/toggleAuto";
import { hatchEggDefinition } from "./hatchEgg";

export const eggs = Net.Definitions.Namespace({
	hatchEgg: hatchEggDefinition,
	toggleAuto: toggleAutoHatchDefinition,
});
