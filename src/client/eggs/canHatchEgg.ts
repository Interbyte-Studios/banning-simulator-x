import { hatchDebounce } from "shared/configs/eggs";

/**
 * Validates that the player has waited long enough and can hatch again.
 *
 * @param lastHatchTime The time eggs were last hatched at.
 * @returns Whether or not the player can hatch.
 */
export function canHatchEgg(lastHatchTime: number): boolean {
	return time() - lastHatchTime > hatchDebounce;
}
