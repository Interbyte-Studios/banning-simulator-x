import Net from "@rbxts/net";

import { deletePetsDefinition } from "./deletePets";
import { enhancePetDefinition } from "./enhancePet";

export const pets = Net.Definitions.Namespace({
	deletePets: deletePetsDefinition,
	enhancePet: enhancePetDefinition,
});
