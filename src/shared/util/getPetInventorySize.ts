import { DEFAULT_INVENTORY_SIZE } from "shared/configs/pets";

/**
 * Returns the number of pets a player can have in their inventory.
 *
 * @returns The pet inventory size.
 */
export function getPetInventorySize(): number {
	// should be modified to accommodate gamepass powers in the future.
	return DEFAULT_INVENTORY_SIZE;
}
