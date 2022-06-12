import { hatchDebounce } from "shared/configs/eggs";

let lastHatchTime = 0;

/**
 * Validates that the player has waited long enough and can hatch again.
 *
 * @returns Whether or not the player can hatch.
 */
export function canHatchEgg(): boolean {
	const now = time();
	if (now - lastHatchTime < hatchDebounce) {
		return false;
	}
	lastHatchTime = now;
	return true;
}
