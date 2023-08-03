import Net from "@rbxts/net";

import { toggleAutoHatchDefinition } from "./toggleAuto";
import { toggleManualFightingDefinition } from "./toggleManualFighting";
import { toggleWalkSpeedDefinition } from "./toggleWalkSpeed";

export const gameplay = Net.Definitions.Namespace({
	toggleAuto: toggleAutoHatchDefinition,
	toggleWalkSpeed: toggleWalkSpeedDefinition,
	toggleManualFighting: toggleManualFightingDefinition,
});
