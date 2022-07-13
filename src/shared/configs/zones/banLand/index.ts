import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import type { Zone } from "..";
import { BAN_LAND_NPCS } from "./npcs";

export const BAN_LAND_ZONES = preserveWithConstraint<Record<string, Zone>>()({
	// zone 1
	Forest: {
		id: 1,
		npcs: [BAN_LAND_NPCS.bronzePiece, BAN_LAND_NPCS.russoTalks],
		cost: undefined,
	},

	// zone 2
	Desert: {
		id: 2,
		npcs: [BAN_LAND_NPCS.nyxun, BAN_LAND_NPCS.sonsofFun_YT],
		cost: {
			currency: "gold",
			amount: 10_000,
			requiredRank: 3,
		},
	},

	// zone 3
	"Sunflower Field": {
		id: 3,
		npcs: [BAN_LAND_NPCS.onett, BAN_LAND_NPCS.carbonMeister],
		cost: {
			currency: "gold",
			amount: 40_000,
			requiredRank: 6,
		},
	},

	// zone 4
	Honeycomb: {
		id: 4,
		npcs: [BAN_LAND_NPCS.rellhub, BAN_LAND_NPCS.sabrinaBrite],
		cost: {
			currency: "gold",
			amount: 200_000,
			requiredRank: 8,
		},
	},

	// zone 5
	"Ice Land": {
		id: 5,
		npcs: [BAN_LAND_NPCS.buildIntoGames, BAN_LAND_NPCS.djMonopoli],
		cost: {
			currency: "gold",
			amount: 1_000_000,
			requiredRank: 10,
		},
	},

	// zone 6
	Beach: {
		id: 6,
		npcs: [BAN_LAND_NPCS.foreverDev, BAN_LAND_NPCS.merely],
		cost: {
			currency: "gold",
			amount: 5_000_000,
			requiredRank: 12,
		},
	},

	// zone 7
	"Candy Land": {
		id: 7,
		npcs: [BAN_LAND_NPCS.snickTrix, BAN_LAND_NPCS.alvin_Blox],
		cost: {
			currency: "gold",
			amount: 30_000_000,
			requiredRank: 14,
		},
	},

	// zone 8
	"The Mines": {
		id: 8,
		npcs: [BAN_LAND_NPCS.mygame43, BAN_LAND_NPCS.deeterPlays],
		cost: {
			currency: "gold",
			amount: 180_000_000,
			requiredRank: 15,
		},
	},

	// zone 9
	"Lava Lands": {
		id: 9,
		npcs: [BAN_LAND_NPCS.gamesReborn, BAN_LAND_NPCS.beeism],
		cost: {
			currency: "gold",
			amount: 1_000_000_000,
			requiredRank: 16,
		},
	},
});
