import { preserveWithConstraint } from "shared/util/preserveWithConstraint";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { Currency } from "./currencies";

export interface Talisman {
	id: number;

	tier: number;

	cost: {
		currency: Currency;
		amount: number;
	};

	stats: {
		experience?: number;
		damage?: number;
		health?: number;
	};
}

export const TALISMANS = preserveWithConstraint<Record<string, Talisman>>()({
	"All Seeing Talisman": {
		id: 1,
		tier: 1,
		cost: {
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("1k"),
		},
		stats: {
			damage: 2,
		},
	},
	"Jester Talisman": {
		id: 2,
		tier: 2,
		cost: {
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("3k"),
		},
		stats: {
			damage: 5,
		},
	},
	"Blade Talisman": {
		id: 3,
		tier: 3,
		cost: {
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("7k"),
		},
		stats: {
			damage: 8,
		},
	},
	"Target Talisman": {
		id: 4,
		tier: 4,
		cost: {
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("10k"),
		},
		stats: {
			damage: 12,
		},
	},
	"Lunar Talisman": {
		id: 5,
		tier: 5,
		cost: {
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("14k"),
		},
		stats: {
			damage: 15,
		},
	},
});

export const TALISMAN_LEVELS: Array<{ level: number; requiredBans: number }> = [
	{
		level: 1,
		requiredBans: 5,
	},
	{
		level: 2,
		requiredBans: 10,
	},
];

export type Talismans = typeof TALISMANS;
export type TalismanIndex = keyof typeof TALISMANS;
