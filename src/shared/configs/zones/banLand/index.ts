import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import type { Zone } from "..";
import { BAN_LAND_NPCS } from "./npcs";

export const BAN_LAND_ZONES = preserveWithConstraint<Record<string, Zone>>()({
	// zone 1
	Forest: {
		id: 1,
		npcs: [BAN_LAND_NPCS.bronzePiece, BAN_LAND_NPCS.russoTalks],
		cost: undefined,
		color: Color3.fromRGB(37, 135, 43),
	},

	// zone 2
	Desert: {
		id: 2,
		npcs: [BAN_LAND_NPCS.nyxun, BAN_LAND_NPCS.sonsofFun_YT],
		cost: {
			currency: "coins",
			amount: 1_000,
			requiredRank: 1,
		},
		color: Color3.fromRGB(154, 106, 79),
	},

	// zone 3
	"Sunflower Field": {
		id: 3,
		npcs: [BAN_LAND_NPCS.rellhub, BAN_LAND_NPCS.carbonMeister],
		cost: {
			currency: "coins",
			amount: 3_000,
			requiredRank: 1,
		},
		color: Color3.fromRGB(61, 163, 90),
	},

	// zone 4
	Honeycomb: {
		id: 4,
		npcs: [BAN_LAND_NPCS.onett, BAN_LAND_NPCS.sabrinaBrite],
		cost: {
			currency: "coins",
			amount: 9_000,
			requiredRank: 2,
		},
		color: Color3.fromRGB(175, 128, 99),
	},

	// zone 5
	"Ice Land": {
		id: 5,
		npcs: [BAN_LAND_NPCS.buildIntoGames, BAN_LAND_NPCS.djMonopoli],
		cost: {
			currency: "coins",
			amount: 27_000,
			requiredRank: 3,
		},
		color: Color3.fromRGB(152, 166, 175),
	},

	// zone 6
	Beach: {
		id: 6,
		npcs: [BAN_LAND_NPCS.foreverDev, BAN_LAND_NPCS.merely],
		cost: {
			currency: "coins",
			amount: 81_000,
			requiredRank: 4,
		},
		color: Color3.fromRGB(7, 113, 170),
	},

	// zone 7
	"Candy Land": {
		id: 7,
		npcs: [BAN_LAND_NPCS.snickTrix, BAN_LAND_NPCS.alvin_Blox],
		cost: {
			currency: "coins",
			amount: 243_000,
			requiredRank: 5,
		},
		color: Color3.fromRGB(206, 130, 160),
	},

	// zone 8
	"The Mines": {
		id: 8,
		npcs: [BAN_LAND_NPCS.mygame43, BAN_LAND_NPCS.deeterPlays],
		cost: {
			currency: "coins",
			amount: 729_000,
			requiredRank: 6,
		},
		color: Color3.fromRGB(98, 37, 209),
	},

	// zone 9
	"Lava Lands": {
		id: 9,
		npcs: [BAN_LAND_NPCS.gamesReborn, BAN_LAND_NPCS.beeism],
		cost: {
			currency: "coins",
			amount: 1_500_000,
			requiredRank: 7,
		},
		color: Color3.fromRGB(213, 115, 61),
	},

	// zone 10 (Emerald)
	// zone 11 (Draconic)
	// zone 12 (Pendulum)
});
