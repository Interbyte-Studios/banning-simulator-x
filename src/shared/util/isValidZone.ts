import { WORLDS } from "shared/configs/worlds";
import { ZoneNames } from "shared/configs/zones";

/**
 * Checks to see if a given `value` is a valid zone.
 *
 * @param value The item to validate.
 * @returns If the item is a valid key of the {@link WORLDS}.
 */
export function isValidZone(value: unknown): value is ZoneNames {
	for (const [, worldData] of pairs(WORLDS)) {
		if (worldData.zones[value as ZoneNames]) {
			return true;
		}
	}
	return false;
}
