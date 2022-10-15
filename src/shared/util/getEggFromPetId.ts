import { EggName, EGGS } from "shared/configs/eggs";

/**
 * Returns the name of the egg a pet comes from.
 *
 * @param petId The id of the pet.
 * @returns The name of the egg.
 */
export function getEggNameFromPetId(petId: number): EggName {
	let originEgg: EggName | undefined;

	for (const [eggName, eggData] of pairs(EGGS)) {
		for (const [, petData] of pairs(eggData.pets)) {
			if (petData.id === petId) {
				originEgg = eggName;
			}
		}
	}

	assert(originEgg, `Failed to get name of egg for pet with id: "${petId}"`);

	return originEgg;
}
