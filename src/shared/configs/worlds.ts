import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Currency } from "./currencies";
import { Zones } from "./zones";
import { BAN_LAND_ZONES } from "./zones/banLand";

interface World {
	/**
	 * The zones available in the world.
	 */
	zones: Zones;
	/**
	 * The currency to reward players with.
	 */
	reward: Currency;

	/**
	 * The id of the world.
	 */
	id: number;
}

/**
 * All the worlds in the game.
 */
export const WORLDS = preserveWithConstraint<Record<string, World>>()({
	"Ban Land": {
		zones: BAN_LAND_ZONES,
		reward: "coins",
		id: 1,
		music: {
			Smooth: 1837111764,
			Paradise: 1837879082,
			Leisure: 1836057733,
			//Arcade: 1842976958, -- for cyber world
			//SonicSunrise: 1838587765, -- may not use
		},
	},
});

export type WorldName = keyof typeof WORLDS;
export type Worlds = typeof WORLDS;
