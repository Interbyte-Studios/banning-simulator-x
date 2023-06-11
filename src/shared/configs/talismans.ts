import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

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
			amount: 1_000,
			rank: 2,
		},
		stats: {
			experience: 0.05,
			damage: 15,
			walkspeed: 6,
		},
	},
	"Jester Talisman": {
		id: 2,
		cost: {
			currency: "coins",
			amount: 4_000,
			rank: 2,
		},
		stats: {
			experience: 0.1,
			damage: 30,
			walkspeed: 8,
		},
	},
	"Blade Talisman": {
		id: 3,
		cost: {
			currency: "coins",
			amount: 12_000,
			rank: 3,
		},
		stats: {
			experience: 0.2,
			damage: 60,
			walkspeed: 12,
		},
	},
	"Target Talisman": {
		id: 4,
		cost: {
			currency: "coins",
			amount: 35_000,
			rank: 4,
		},
		stats: {
			experience: 0.3,
			damage: 120,
			walkspeed: 19,
		},
	},
	"Lunar Talisman": {
		id: 5,
		cost: {
			currency: "coins",
			amount: 45_000,
			rank: 5,
		},
		stats: {
			experience: 0.4,
			damage: 150,
			walkspeed: 28,
		},
	},
	"Star Talisman": {
		id: 6,
		cost: {
			currency: "coins",
			amount: 225_000,
			rank: 6,
		},
		stats: {
			experience: 0.5,
			damage: 300,
			walkspeed: 34,
		},
	},
	"Skull Talisman": {
		id: 7,
		cost: {
			currency: "coins",
			amount: 375_000,
			rank: 7,
		},
		stats: {
			experience: 0.65,
			damage: 400,
			walkspeed: 40,
		},
	},
	"Heart Talisman": {
		id: 8,
		cost: {
			currency: "coins",
			amount: 750_000,
			rank: 7,
		},
		stats: {
			experience: 0.8,
			damage: 600,
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
