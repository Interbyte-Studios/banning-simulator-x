import { EggName } from "shared/configs/eggs";
import { Pet } from "shared/configs/pets";

import { getEggData } from "./getEggData";

interface PetData extends Pet {
	name: string;
}

/**
 * Fetches the metadata of a specified pet.
 *
 * @param egg The metadata of the egg.
 * @param petId The id of the pet.
 * @returns Pet data of specified pet.
 */
export function getPetData(egg: EggName, petId: number): PetData {
	const eggData = getEggData(egg);

	for (const [name, metadata] of pairs(eggData.pets)) {
		if (metadata.id !== petId) continue;

		const _petData = { ...metadata, name };

		return _petData;
	}
	throw `Expected to find pet data for pet with id: "${petId}"`;
}
