import { EGGS } from "shared/configs/eggs";
import { Pet } from "shared/configs/pets";

interface PetData extends Pet {
	name: string;
}

const petIdToData: Map<number, PetData> = new Map();
for (const [, eggData] of pairs(EGGS)) {
	for (const [name, metadata] of pairs(eggData.pets)) {
		const petData = { ...metadata, name };
		petIdToData.set(metadata.id, petData);
	}
}

/**
 * Fetches the metadata of a specified pet.
 *
 * @param petId The id of the pet.
 * @returns Pet data of specified pet.
 */
export function getPetData(petId: number): PetData {
	const petData = petIdToData.get(petId);
	assert(petData, `Expected to find pet data for pet with id: "${petId}"`);

	return petData;
}
