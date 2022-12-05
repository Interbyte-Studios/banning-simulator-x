import { PET_LEVEL_REQUIREMENTS } from "shared/configs/pets";
import { Pet } from "shared/rodux/pets";

import { getPetData } from "./getPetData";
import { getPetLevel } from "./getPetLevel";

/**
 * Calculates the strength of a stored pet.
 *
 * @param pet The first stored pet.
 * @returns The strength of the pet.
 */
export function getPetStrength(pet: Pet): number {
	const petData = getPetData(pet.id);
	const petLevel = getPetLevel(pet);

	const maxLevel = PET_LEVEL_REQUIREMENTS[pet.variant];
	const strengthPerLevel = petData.stats.additionalDamage / maxLevel;

	const petDamage = math.floor(petData.stats.additionalDamage + petLevel * strengthPerLevel);

	return petDamage;
}
