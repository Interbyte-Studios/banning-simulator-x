import Net from "@rbxts/net";

import { claimPetMasteryDefinition } from "./claimMastery";
import { togglePetMasteryCosmetic } from "./toggleCosmetic";

export const petMastery = Net.Definitions.Namespace({
	claimMastery: claimPetMasteryDefinition,
	toggleCosmetic: togglePetMasteryCosmetic,
});
