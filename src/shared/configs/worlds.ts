import { Zone } from "./zones";
import { BAN_LAND_ZONES } from "./zones/banLand";

interface World {
	/**
	 * The zones available in the world.
	 */
	zones: Array<Zone>;
}

/**
 * All the worlds in the game.
 */
export const WORLDS = {
	"Ban Land": identity<World>({
		zones: BAN_LAND_ZONES,
	}),
};

/**
 * Checks to see if a given `value` is a valid world.
 *
 * @param value The item to validate.
 * @returns If the item is a valid key of the {@link WORLDS}.
 */
export function isValidWorld(value: unknown): value is keyof typeof WORLDS {
	return WORLDS[value as keyof typeof WORLDS] !== undefined;
}
