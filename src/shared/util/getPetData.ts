import { EGGS } from "shared/configs/eggs";
import { Pet } from "shared/configs/pets";

const petIdToData: Map<number, Pet> = new Map();
for (const [, eggData] of pairs(EGGS)) {
	for (const pet of eggData.pets) {
		petIdToData.set(pet.id, pet);
	}
}

/**
 * Fetches the metadata of a specified pet.
 *
 * @param petId The id of the pet.
 * @returns Pet data of specified pet.
 */
export function getPetData(petId: number): Pet {
	const petData = petIdToData.get(petId);
	assert(petData, `Expected to find pet data for pet with id: "${petId}"`);

	return petData;
}
