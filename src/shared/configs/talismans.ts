import { preserveWithConstraint } from "shared/util/preserveWithConstraint";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { Currency } from "./currencies";

export type talismanStats = "health" | "damage" | "experience";

export interface Talisman {
	id: number;

	tier: number;

	cost: {
		currency: Currency;
		amount: number;
	};

	stats: {
		name: talismanStats;
		amount: number;
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
			name: "damage",
			amount: 2,
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
			name: "damage",
			amount: 5,
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
			name: "damage",
			amount: 10,
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
			name: "health",
			amount: 10,
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
			name: "experience",
			amount: 10,
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
