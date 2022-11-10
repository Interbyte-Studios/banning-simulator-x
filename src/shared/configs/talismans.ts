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
			amount: twoDpAbbreviator.stringToNumber("100k"),
			rank: 6,
		},
		stats: {
			name: "damage",
			amount: 250,
			maxSpeed: 6,
		},
	},
	"Jester Talisman": {
		id: 2,
		tier: 2,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("500k"),
			rank: 8,
		},
		stats: {
			name: "damage",
			amount: 600,
			maxSpeed: 8,
		},
	},
	"Blade Talisman": {
		id: 3,
		tier: 3,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("5M"),
			rank: 10,
		},
		stats: {
			name: "damage",
			amount: 7500,
			maxSpeed: 12,
		},
	},
	"Target Talisman": {
		id: 4,
		tier: 4,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("12B"),
			rank: 15,
		},
		stats: {
			name: "damage",
			amount: twoDpAbbreviator.stringToNumber("120k"),
			maxSpeed: 19,
		},
	},
	"Lunar Talisman": {
		id: 5,
		tier: 5,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("35B"),
			rank: 18,
		},
		stats: {
			name: "damage",
			amount: twoDpAbbreviator.stringToNumber("500k"),
			maxSpeed: 28,
		},
	},
	"Star Talisman": {
		id: 6,
		tier: 6,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("50B"),
			rank: 20,
		},
		stats: {
			name: "experience",
			amount: 1.5,
			maxSpeed: 34,
		},
	},
	"Skull Talisman": {
		id: 7,
		tier: 6,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("50B"),
			rank: 20,
		},
		stats: {
			name: "damage",
			amount: twoDpAbbreviator.stringToNumber("5M"),
			maxSpeed: 34,
		},
	},
	"Heart Talisman": {
		id: 8,
		tier: 6,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("50B"),
			rank: 20,
		},
		stats: {
			name: "health",
			amount: 1000,
			maxSpeed: 34,
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
