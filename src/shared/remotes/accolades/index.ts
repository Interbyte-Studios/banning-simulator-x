import Net from "@rbxts/net";

import { claimAccoladeDefinition } from "./claimAccolade";

export const accolades = Net.Definitions.Namespace({
	claimAccolade: claimAccoladeDefinition,
});
