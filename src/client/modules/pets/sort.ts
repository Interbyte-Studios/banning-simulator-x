import { PetInventoryData } from "client/ui/components/items/pets/inventory";
import { RARITIES } from "shared/configs/rarities";
import { Pet, PetsState } from "shared/rodux/pets";
import { getPetData } from "shared/util/getPetData";
import { getPetStrength } from "shared/util/getPetStrength";

const variantMapping = { regular: 1, void: 2, radiant: 3 };

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
	table.sort(pets, (pet1: Pet, pet2: Pet) => {
		// Sort by equipped status if requested
		if (checkForEquipped) {
			if (pet1.equipped !== pet2.equipped) {
				return pet1.equipped;
			}
		}

		// Sort by locked status if requested
		if (checkForLocked) {
			if (pet1.locked !== pet2.locked) {
				return pet1.locked;
			}
		}

		// Sort by strength
		const pet1Strength = getPetStrength(pet1);
		const pet2Strength = getPetStrength(pet2);
		if (pet1Strength !== pet2Strength) {
			return pet1Strength > pet2Strength;
		}

		// Get pet data
		const pet1Data = getPetData(pet1.id);
		const pet2Data = getPetData(pet2.id);

		// Sort by rarity
		const pet1RarityData = RARITIES[pet1Data.rarity];
		const pet2RarityData = RARITIES[pet2Data.rarity];
		if (pet1Data.rarity !== pet2Data.rarity) {
			return pet1RarityData.id > pet2RarityData.id;
		}

		// Sort by variant
		const pet1Variant = variantMapping[pet1.variant];
		const pet2Variant = variantMapping[pet2.variant];
		if (pet1Variant !== pet2Variant) {
			return pet1Variant > pet2Variant;
		}

		// Sort by name
		if (pet1Data.name !== pet2Data.name) {
			return pet1Data.name > pet2Data.name;
		}

		// If all other sort criteria are equal, sort by GUID
		return pet1.guid > pet2.guid;
	});
}
