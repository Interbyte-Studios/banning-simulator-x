import { EggNames, EGGS } from "shared/configs/eggs";

/**
 * Returns the name of the egg that the specified pet comes from.
 *
 * @param petId The unique id of the pet.
 * @returns The name of the associated egg.
 */
export function getEggNameFromPetId(petId: number): EggNames {
	let eggName: EggNames | undefined;

	for (const [eggName, eggData] of pairs(EGGS)) {
		for (const [petName, petData] of pairs(eggData.pets)) {
			//
		}
	}

	assert(eggName !== undefined, `Did not find associate egg for pet with id ${petId}`);

	return eggName;
}
