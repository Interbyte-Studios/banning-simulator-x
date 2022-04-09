import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Currency } from "./currencies";
import { Zone } from "./zones";
import { BAN_LAND_ZONES } from "./zones/banLand";

interface World {
	/**
	 * The zones available in the world.
	 */
	zones: Array<Zone>;
	/**
	 * The currency to reward players with.
	 */
	reward: Currency;
}

/**
 * All the worlds in the game.
 */
export const WORLDS = preserveWithConstraint<Record<string, World>>()({
	"Ban Land": {
		zones: BAN_LAND_ZONES,
		reward: "gold",
	},
});
export type Worlds = typeof WORLDS;
