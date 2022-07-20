import Net from "@rbxts/net";

import { toggleAutoHatchDefinition } from "./toggleAuto";
import { toggleWalkSpeedDefinition } from "./toggleWalkSpeed";

export const gameplay = Net.Definitions.Namespace({
	toggleAuto: toggleAutoHatchDefinition,
	toggleWalkSpeed: toggleWalkSpeedDefinition,
});
