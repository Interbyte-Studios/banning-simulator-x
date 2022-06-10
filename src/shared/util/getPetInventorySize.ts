import { DEFAULT_INVENTORY_SIZE } from "shared/configs/pets";
import { Store } from "shared/rodux";

/**
 * Returns the number of pets a player can have in their inventory.
 *
 * @param store The rodux store of the player.
 * @returns The pet inventory size.
 */
export function getPetInventorySize(store: Store): number {
	const currentState = store.getState();

	let additionalSize = 0;
	if (currentState.gamepasses["+250 Inventory Slots"]) {
		additionalSize += 250;
	}

	if (currentState.gamepasses["+450 Inventory Slots"]) {
		additionalSize += 450;
	}

	return DEFAULT_INVENTORY_SIZE + additionalSize;
}
