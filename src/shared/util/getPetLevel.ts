import { PET_LEVEL_REQUIREMENTS, PET_MAX_LEVELS } from "shared/configs/pets";
import { Pet } from "shared/rodux/pets";

/**
 * Calculates the level of a stored pet.
 *
 * @param pet The first stored pet.
 * @returns The level of the stored pet.
 */
export function getPetLevel(pet: Pet): number {
	const maxLevel = PET_MAX_LEVELS[pet.variant];
	const petLevel = pet.bans / PET_LEVEL_REQUIREMENTS[pet.variant];
	if (petLevel > maxLevel) {
		return maxLevel;
	}

	if (petLevel <= 0) {
		return 1;
	}

	return math.floor(petLevel);
}
