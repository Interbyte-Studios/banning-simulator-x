import { t } from "@rbxts/t";

import { Currency } from "./currencies";

interface World {
	/**
	 * The currency to reward players with.
	 */
	reward: Currency;
	/**
	 * The songs that exist to play in this world.
	 */
	music: Array<number>;

	/**
	 * The id of the world.
	 */
	id: number;

	// Cost options (optional).
	cost:
		| {
				requiredRank: number;
				currencyType: Currency;
				amount: number;
		  }
		| undefined;
}

export const isWorldName = t.literal("Ban Land", "Cyber Cities");
export type WorldName = t.static<typeof isWorldName>;

/**
 * All the worlds in the game.
 */
export const WORLDS = {
	"Ban Land": {
		reward: "coins",
		id: 1,
		music: [1837111764, 1837879082, 1836057733],
		cost: undefined,
	},
	"Cyber Cities": {
		reward: "cyber tokens",
		id: 2,
		music: [1842976958, 1838587765],
		cost: {
			requiredRank: 10,
			currencyType: "coins",
			amount: 60_000_000,
		},
	},
} satisfies Record<WorldName, World>;

export type Worlds = typeof WORLDS;
