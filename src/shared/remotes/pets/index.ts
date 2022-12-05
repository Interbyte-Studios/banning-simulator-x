import Net from "@rbxts/net";

import { deletePetsDefinition } from "./deletePets";
import { enhancePetDefinition } from "./enhancePet";
import { equipPetsDefinition } from "./equipPets";
import { lockPetsDefinition } from "./lockPets";

export const pets = Net.Definitions.Namespace({
	deletePets: deletePetsDefinition,
	equipPets: equipPetsDefinition,
	enhancePet: enhancePetDefinition,
	lockPets: lockPetsDefinition,
});
