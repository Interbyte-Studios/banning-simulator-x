import { EggName, EGGS } from "shared/configs/eggs";

const petIdToEggName: Map<number, EggName> = new Map();
for (const [eggName, eggData] of pairs(EGGS)) {
	for (const pet of eggData.pets) {
		petIdToEggName.set(pet.id, eggName);
	}
}

/**
 * Returns the name of the egg a pet comes from.
 *
 * @param petId The id of the pet.
 * @returns The name of the egg.
 */
export function getEggNameFromPetId(petId: number): EggName {
	const originEgg = petIdToEggName.get(petId);
	assert(originEgg, `Failed to get name of egg for pet with id: "${petId}"`);

	return originEgg;
}
