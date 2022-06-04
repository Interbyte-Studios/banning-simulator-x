import { EggNames } from "shared/configs/eggs";
import { Pet } from "shared/configs/pets";

import { getEggData } from "./getEggData";

interface PetData {
	petName: string;
	petData: Pet;
}

/**
 * Fetches the metadata of a specified pet.
 *
 * @param egg The metadata of the egg.
 * @param petId The id of the pet.
 * @returns Pet data of specified pet.
 */
export function getPetData(egg: EggNames, petId: number): PetData {
	const eggData = getEggData(egg);

	for (const [petName, petData] of pairs(eggData.pets)) {
		if (petData.id !== petId) continue;

		const _petData = {
			petName: petName,
			petData: petData,
		};

		return _petData;
	}
	throw `Expected to find pet data for pet with id: "${petId}"`;
}
