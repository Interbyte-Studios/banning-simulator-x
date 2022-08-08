import Net from "@rbxts/net";

import { equipTalismanDefinition } from "./equipTalisman";
import { purchaseTalismanDefinition } from "./purchaseTalisman";

export const talismans = Net.Definitions.Namespace({
	equipTalisman: equipTalismanDefinition,
	purchaseTalisman: purchaseTalismanDefinition,
});
