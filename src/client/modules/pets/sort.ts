import { RARITIES } from "shared/configs/rarities";
import { Pet, PetsState } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";
import { getPetStrength } from "shared/util/getPetStrength";

export enum PetSortType {
	Strength,
	Rarity,
	Alphabetical,
}

/**
 * @param pet1 The first stored pet.
 * @param pet2 The second stored pet.
 * @returns Returns true when the first pet must come before the second.
 */
function checkEquipped(pet1: Pet, pet2: Pet): boolean {
	if (pet1.equipped && !pet2.equipped) {
		return true;
	}

	if (pet2.equipped && !pet1.equipped) {
		return false;
	}

	return true;
}

/**
 * @param pet1 The first stored pet.
 * @param pet2 The second stored pet.
 * @returns Returns true when the first pet must come before the second.
 */
function checkRarity(pet1: Pet, pet2: Pet): boolean {
	const pet1Data = getPetData(pet1.id);
	const pet2Data = getPetData(pet2.id);

	const pet1RarityData = RARITIES[pet1Data.rarity];
	const pet2RarityData = RARITIES[pet2Data.rarity];

	return pet1RarityData.id > pet2RarityData.id;
}

/**
 * @param pet1 The first stored pet.
 * @param pet2 The second stored pet.
 * @returns Returns true when the first pet must come before the second.
 */
function checkStrength(pet1: Pet, pet2: Pet): boolean {
	const pet1Strength = getPetStrength(pet1);
	const pet2Strength = getPetStrength(pet2);

	return pet1Strength > pet2Strength;
}

/**
 * Sorts a collection of pets based on a specified sort type.
 *
 * @param pets The collection of pets to sort.
 * @param sortType The type of sort used on the collection of pets.
 * @returns The sorted collection of pets.
 */
export function sortPets(pets: PetsState, sortType: PetSortType): PetsState {
	const sortedPets = pets;

	switch (sortType) {
		case PetSortType.Strength: {
			sortedPets.sort((pet1, pet2) => {
				return checkStrength(pet1, pet2);
			});
			break;
		}
		case PetSortType.Rarity: {
			sortedPets.sort((pet1, pet2) => {
				return checkRarity(pet1, pet2);
			});
			break;
		}
		default: {
			throw `Unsupported sort type: ${tostring(sortType)}`;
		}
	}

	return [];
}
