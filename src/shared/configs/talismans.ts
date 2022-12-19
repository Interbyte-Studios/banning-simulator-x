import { preserveWithConstraint } from "shared/util/preserveWithConstraint";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { Currency } from "./currencies";

export interface TalismanStatEffects {
	damage: number;
	experience: number;
	walkspeed: number;
}

export type TalismanPhases = "normal" | "awakend" | "artifact";

export interface Talisman {
	id: number;

	cost: {
		currency: Currency;
		amount: number;
		rank: number;
	};

	stats: TalismanStatEffects;
}

export const TALISMANS = preserveWithConstraint<Record<string, Talisman>>()({
	"All Seeing Talisman": {
		id: 1,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("100k"),
			rank: 6,
		},
		stats: {
			experience: 1.05,
			damage: 250,
			walkspeed: 6,
		},
	},
	"Jester Talisman": {
		id: 2,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("500k"),
			rank: 8,
		},
		stats: {
			experience: 1.1,
			damage: 600,
			walkspeed: 8,
		},
	},
	"Blade Talisman": {
		id: 3,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("5M"),
			rank: 10,
		},
		stats: {
			experience: 1.2,
			damage: 7500,
			walkspeed: 12,
		},
	},
	"Target Talisman": {
		id: 4,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("12B"),
			rank: 12,
		},
		stats: {
			experience: 1.3,
			damage: 120_000,
			walkspeed: 19,
		},
	},
	"Lunar Talisman": {
		id: 5,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("35B"),
			rank: 14,
		},
		stats: {
			experience: 1.4,
			damage: 500_000,
			walkspeed: 28,
		},
	},
	"Star Talisman": {
		id: 6,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("50B"),
			rank: 16,
		},
		stats: {
			experience: 1.5,
			damage: 1_200_000,
			walkspeed: 34,
		},
	},
	"Skull Talisman": {
		id: 7,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("50B"),
			rank: 18,
		},
		stats: {
			experience: 1.65,
			damage: 1_500_000,
			walkspeed: 40,
		},
	},
	"Heart Talisman": {
		id: 8,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("50B"),
			rank: 20,
		},
		stats: {
			experience: 1.8,
			damage: 2_000_000,
			walkspeed: 45,
		},
	},
});

export const TALISMAN_PHASES: Array<{
	phase: TalismanPhases;
	requiredBans: number;
	id: number;
	gradient?: { beginningColor: Color3; endingColor: Color3 };
}> = [
	{
		phase: "normal",
		requiredBans: 0,
		id: 1,
	},
	{
		phase: "awakend",
		requiredBans: 750,
		id: 2,
		gradient: {
			beginningColor: Color3.fromRGB(241, 76, 78),
			endingColor: Color3.fromRGB(239, 210, 210),
		},
	},
	{
		phase: "artifact",
		requiredBans: 1500,
		id: 3,
		gradient: {
			beginningColor: Color3.fromRGB(255, 149, 227),
			endingColor: Color3.fromRGB(0, 255, 183),
		},
	},
];

export type Talismans = typeof TALISMANS;
export type TalismanIndex = keyof typeof TALISMANS;
