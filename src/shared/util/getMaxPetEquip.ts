import { DEFAULT_EQUIP_AMOUNT } from "shared/configs/pets";
import { Store } from "shared/rodux";

/**
 * Returns the number of pets a player can have equipped.
 *
 * @param store The rodux store of the player.
 * @returns The amount of pets a player can equip.
 */
export function getMaxPetEquip(store: Store): number {
	const currentState = store.getState();

	let additionalPets = 0;
	if (currentState.gamepasses["+2 Pets Equipped"]) {
		additionalPets += 2;
	}

	if (currentState.gamepasses["+3 Pets Equipped"]) {
		additionalPets += 3;
	}

	return DEFAULT_EQUIP_AMOUNT + additionalPets;
}
