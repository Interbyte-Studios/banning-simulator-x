import { t } from "@rbxts/t";
import { preserveWithConstraint } from "shared/util/preserveWithConstraint";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { Currency } from "./currencies";

export const talismanStats = ["health", "damage", "experience"] as const;
export const isTalismanStat = t.literal(...talismanStats);
export type TalismanStats = t.static<typeof isTalismanStat>;
export type talismanPhases = "normal" | "awakend" | "artifact";

export interface Talisman {
	id: number;

	tier: number;

	cost: {
		currency: Currency;
		amount: number;
		rank: number;
	};

	stats: {
		name: TalismanStats;
		amount: number;
		maxSpeed: number;
	};
}

export const TALISMANS = preserveWithConstraint<Record<string, Talisman>>()({
	"All Seeing Talisman": {
		id: 1,
		tier: 1,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("1k"),
			rank: 6,
		},
		stats: {
			name: "damage",
			amount: 2,
			maxSpeed: 5,
		},
	},
	"Jester Talisman": {
		id: 2,
		tier: 2,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("3k"),
			rank: 8,
		},
		stats: {
			name: "damage",
			amount: 5,
			maxSpeed: 5,
		},
	},
	"Blade Talisman": {
		id: 3,
		tier: 3,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("7k"),
			rank: 10,
		},
		stats: {
			name: "damage",
			amount: 10,
			maxSpeed: 5,
		},
	},
	"Target Talisman": {
		id: 4,
		tier: 4,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("10k"),
			rank: 15,
		},
		stats: {
			name: "damage",
			amount: 10,
			maxSpeed: 5,
		},
	},
	"Lunar Talisman": {
		id: 5,
		tier: 5,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("14k"),
			rank: 18,
		},
		stats: {
			name: "damage",
			amount: 10,
			maxSpeed: 5,
		},
	},
	"Star Talisman": {
		id: 6,
		tier: 6,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("14k"),
			rank: 20,
		},
		stats: {
			name: "experience",
			amount: 30,
			maxSpeed: 5,
		},
	},
	"Skull Talisman": {
		id: 7,
		tier: 6,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("14k"),
			rank: 20,
		},
		stats: {
			name: "damage",
			amount: 20,
			maxSpeed: 5,
		},
	},
	"Heart Talisman": {
		id: 8,
		tier: 6,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("14k"),
			rank: 20,
		},
		stats: {
			name: "health",
			amount: 15,
			maxSpeed: 5,
		},
	},
});

export const TALISMAN_PHASES: Array<{ phase: talismanPhases; requiredBans: number }> = [
	{
		phase: "normal",
		requiredBans: 0,
	},
	{
		phase: "awakend",
		requiredBans: 5,
	},
	{
		phase: "artifact",
		requiredBans: 10,
	},
];

export type Talismans = typeof TALISMANS;
export type TalismanIndex = keyof typeof TALISMANS;
