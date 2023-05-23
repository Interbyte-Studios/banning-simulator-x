import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("pets");

/**
 * Remotes for pets.
 */
export const petRemtoes = {
	deletePets: remoteNamespace.Get("deletePets"),
	equipPets: remoteNamespace.Get("equipPets"),
	lockPets: remoteNamespace.Get("lockPets"),
	createPetTeam: remoteNamespace.Get("createPetTeam"),
	deletePetTeam: remoteNamespace.Get("deletePetTeam"),
	changePetTeamName: remoteNamespace.Get("changePetTeamName"),
};
