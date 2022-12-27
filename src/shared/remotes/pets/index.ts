import Net from "@rbxts/net";

import { changePetTeamNameDefinition } from "./changePetTeamName";
import { createPetTeamDefinition } from "./createPetTeam";
import { deletePetsDefinition } from "./deletePets";
import { deletePetTeamDefinition } from "./deletePetTeam";
import { enhancePetDefinition } from "./enhancePet";
import { equipPetsDefinition } from "./equipPets";
import { lockPetsDefinition } from "./lockPets";

export const pets = Net.Definitions.Namespace({
	changePetTeamName: changePetTeamNameDefinition,
	createPetTeam: createPetTeamDefinition,
	deletePets: deletePetsDefinition,
	deletePetTeam: deletePetTeamDefinition,
	equipPets: equipPetsDefinition,
	enhancePet: enhancePetDefinition,
	lockPets: lockPetsDefinition,
});
