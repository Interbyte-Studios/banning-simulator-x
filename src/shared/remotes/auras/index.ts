import Net from "@rbxts/net";

import { equipAuraDefinition } from "./equipAura";

export const auras = Net.Definitions.Namespace({
	equipAura: equipAuraDefinition,
});
