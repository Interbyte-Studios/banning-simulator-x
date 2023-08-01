import { getMagnitudeBetweenPlayerAndObject } from "shared/util/getDistanceFromObject";

/**
 * The distance in studs that the player must be near the egg adornee to activate the HUD.
 */
const DISPLAY_DISTANCE = 120;

/**
 * Checks if the promptdisplay for a given `character` and `adornee`.
 *
 * @param character The character to check the magnitude for.
 * @param adornee The adornee to determine the distance from.
 * @returns If the prompt should display.
 */
export function shouldDisplay(character: Model | undefined, adornee: BasePart): boolean {
	debug.setmemorycategory("shouldDisplay");
	if (!character) {
		return false;
	}

	return (getMagnitudeBetweenPlayerAndObject(character, adornee) ?? math.huge) <= DISPLAY_DISTANCE;
}
