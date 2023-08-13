import { DEFAULT_EQUIP_AMOUNT } from "shared/configs/pets";
import { GamepassesState } from "shared/rodux/gamepasses";
import { RebirthState } from "shared/rodux/rebirths";

/**
 * Returns the number of pets a player can have equipped.
 *
 * @param player The player object.
 * @param gamepasses The gamepasses state.
 * @param rebirthState The state of rebirths.
 * @returns The amount of pets a player can equip.
 */
export function getMaxPetEquip(player: Player, gamepasses: GamepassesState, rebirthState: RebirthState): number {
	let additionalPets = 0;
	if (gamepasses["+2 Pets Equipped"]) {
		additionalPets += 2;
	}

	if (gamepasses["+3 Pets Equipped"]) {
		additionalPets += 3;
	}

	additionalPets += rebirthState.additionalPets;

	return DEFAULT_EQUIP_AMOUNT + additionalPets;
}
