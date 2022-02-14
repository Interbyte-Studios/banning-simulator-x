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
