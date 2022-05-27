import { Egg } from "shared/configs/eggs";
import { Pet } from "shared/configs/pets";

/**
 * Fetches the metadata of a specified pet.
 *
 * @param egg The metadata of the egg.
 * @param petId The id of the pet.
 * @returns Pet data of specified pet.
 */
export function getPetData(egg: Egg, petId: number): Pet {
	let petInfo: Pet | undefined;
	for (const [_, petData] of pairs(egg.pets)) {
		if (petData.id !== petId) continue;

		petInfo = petData;
	}
	assert(petInfo !== undefined, `Expected to find pet data for pet with id: "${petId}"`);

	return petInfo;
}
