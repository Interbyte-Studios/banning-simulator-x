import { PetInventoryData } from "client/ui/components/items/pets";
import { RARITIES } from "shared/configs/rarities";
import { Pet, PetsState } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";
import { getPetStrength } from "shared/util/getPetStrength";

/**
 * Sorts pet1 and pet2 by which is equipped.
 *
 * @param nextSort The next sort.
 * @returns Which pet should come before the other in the sort.
 */
export function checkEquipped(nextSort: (pet1: Pet, pet2: Pet) => boolean) {
	return function (pet1: Pet, pet2: Pet): boolean {
		if ((pet1.equipped && pet2.equipped) || (!pet1.equipped && !pet2.equipped)) {
			return nextSort(pet1, pet2);
		}

		return pet1.equipped && !pet2.equipped;
	};
}

/**
 * Sorts pet1 and pet2 by which is locked.
 *
 * @param nextSort The next sort.
 * @returns Which pet should come before the other in the sort.
 */
export function checkLocked(nextSort: (pet1: Pet, pet2: Pet) => boolean) {
	return function (pet1: Pet, pet2: Pet): boolean {
		if ((pet1.locked && pet2.locked) || (!pet1.locked && !pet2.locked)) {
			return nextSort(pet1, pet2);
		}

		return pet1.locked && !pet2.locked;
	};
}

/**
 * Sorts pet1 and pet2 by which has greater strength.
 *
 * @param nextSort The next sort.
 * @returns Which pet should come before the other in the sort.
 */
export function checkStrength(nextSort: (pet1: Pet, pet2: Pet) => boolean) {
	return function (pet1: Pet, pet2: Pet): boolean {
		const pet1Strength = getPetStrength(pet1);
		const pet2Strength = getPetStrength(pet2);

		if (pet1Strength === pet2Strength) {
			return nextSort(pet1, pet2);
		}

		return pet1Strength > pet2Strength;
	};
}

/**
 * Sorts pet1 and pet2 by which has greater strength.
 *
 * @param nextSort The next sort.
 * @returns Which pet should come before the other in the sort.
 */
export function checkRarity(nextSort: (pet1: Pet, pet2: Pet) => boolean) {
	return function (pet1: Pet, pet2: Pet): boolean {
		const pet1Data = getPetData(pet1.id);
		const pet2Data = getPetData(pet2.id);

		const pet1Rarity = RARITIES[pet1Data.rarity];
		const pet2Rarity = RARITIES[pet2Data.rarity];

		if (pet1Rarity.id === pet2Rarity.id) {
			return nextSort(pet1, pet2);
		}

		return pet1Rarity.id > pet2Rarity.id;
	};
}

/**
 * Sorts a collection of pets based on a specified sort type.
 *
 * @param pets The collection of pets to sort.
 * @param checkForEquipped Whether or not to sort for equipped.
 * @param checkForLocked Whether or not to sort for locked.
 */
export function sortPets(
	pets: PetsState | Array<PetInventoryData>,
	checkForEquipped: boolean,
	checkForLocked: boolean,
): void {
	if (checkForEquipped && checkForLocked) {
		table.sort(pets, checkEquipped(checkLocked(checkStrength((pet1, pet2) => pet1.guid > pet2.guid))));
	} else if (checkForEquipped) {
		table.sort(pets, checkEquipped(checkStrength((pet1, pet2) => pet1.guid > pet2.guid)));
	} else if (checkForLocked) {
		table.sort(pets, checkLocked(checkStrength((pet1, pet2) => pet1.guid > pet2.guid)));
	} else {
		table.sort(
			pets,
			checkStrength((pet1, pet2) => pet1.guid > pet2.guid),
		);
	}
}
