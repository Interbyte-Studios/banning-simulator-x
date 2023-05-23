import { ChangePetTeamNameDefinition } from "shared/remotes/pets/changePetTeamName";
import { CreatePetTeamDefinition } from "shared/remotes/pets/createPetTeam";
import { DeletePetsDefinition } from "shared/remotes/pets/deletePets";
import { DeletePetTeamDefinition } from "shared/remotes/pets/deletePetTeam";
import { EquipPetsDefinition } from "shared/remotes/pets/equipPets";
import { LockPetsDefinition } from "shared/remotes/pets/lockPets";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 * This is the remote context for the pets remote functions.
 */
export const petsRemoteContext = {
	deletePets: fakeRemoteCall<DeletePetsDefinition>("deletePets"),
	equipPets: fakeRemoteCall<EquipPetsDefinition>("equipPets"),
	lockPets: fakeRemoteCall<LockPetsDefinition>("lockPets"),
	createPetTeam: fakeRemoteCall<CreatePetTeamDefinition>("createPetTeam"),
	deletePetTeam: fakeRemoteCall<DeletePetTeamDefinition>("deletePetTeam"),
	changePetTeamName: fakeRemoteCall<ChangePetTeamNameDefinition>("changePetTeamName"),
};
