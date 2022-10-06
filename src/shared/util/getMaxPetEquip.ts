import { DEFAULT_EQUIP_AMOUNT } from "shared/configs/pets";
import { GamepassesState } from "shared/rodux/gamepasses";

/**
 * Returns the number of pets a player can have equipped.
 *
 * @param gamepasses The gamepasses state.
 * @returns The amount of pets a player can equip.
 */
export function getMaxPetEquip(gamepasses: GamepassesState): number {
	let additionalPets = 0;
	if (gamepasses["+2 Pets Equipped"]) {
		additionalPets += 2;
	}

	if (gamepasses["+3 Pets Equipped"]) {
		additionalPets += 3;
	}

	return DEFAULT_EQUIP_AMOUNT + additionalPets;
}
