import { DEFAULT_INVENTORY_SIZE } from "shared/configs/pets";
import { GamepassesState } from "shared/rodux/gamepasses";

/**
 * Returns the number of pets a player can have in their inventory.
 *
 * @param gamepassesState The state of the player's gamepasses data.
 * @returns The pet inventory size.
 */
export function getPetInventorySize(gamepassesState: GamepassesState): number {
	let additionalSize = 0;
	if (gamepassesState["+250 Inventory Slots"]) {
		additionalSize += 250;
	}

	if (gamepassesState["+450 Inventory Slots"]) {
		additionalSize += 450;
	}

	return DEFAULT_INVENTORY_SIZE + additionalSize;
}
