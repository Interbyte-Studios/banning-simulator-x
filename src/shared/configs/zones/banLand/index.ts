import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import type { Zone } from "..";
import { BAN_LAND_NPCS } from "./npcs";

export const BAN_LAND_ZONES = preserveWithConstraint<Record<string, Zone>>()({
	// zone 1
	Forest: {
		id: 1,
		npcs: [BAN_LAND_NPCS.forestWizard, BAN_LAND_NPCS.mushroomKing],
		cost: undefined,
		color: Color3.fromRGB(37, 135, 43),
	},

	// zone 2
	Desert: {
		id: 2,
		npcs: [BAN_LAND_NPCS.desertBandit, BAN_LAND_NPCS.desertScout],
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
		npcs: [BAN_LAND_NPCS.floralGirl, BAN_LAND_NPCS.magicFloralMan],
		cost: {
			currency: "coins",
			amount: 3_000,
			requiredRank: 2,
		},
		color: Color3.fromRGB(61, 163, 90),
	},

	// zone 4
	Honeycomb: {
		id: 4,
		npcs: [BAN_LAND_NPCS.beeKing, BAN_LAND_NPCS.onett],
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
		npcs: [BAN_LAND_NPCS.iceSkier, BAN_LAND_NPCS.iceGolem],
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
		npcs: [BAN_LAND_NPCS.beachBoy, BAN_LAND_NPCS.pufferfishKing],
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
		npcs: [BAN_LAND_NPCS.sparkletimeKing, BAN_LAND_NPCS.pastelGuardian],
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
		npcs: [BAN_LAND_NPCS.miningGuy, BAN_LAND_NPCS.elementalKing],
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
		npcs: [BAN_LAND_NPCS.lavaLord, BAN_LAND_NPCS.headlessDoombringer],
		cost: {
			currency: "coins",
			amount: 1_500_000,
			requiredRank: 7,
		},
		color: Color3.fromRGB(213, 115, 61),
	},

	// zone 9
	"Enchanted Forest": {
		id: 10,
		npcs: [BAN_LAND_NPCS.enchantedGolem, BAN_LAND_NPCS.udzal],
		cost: {
			currency: "coins",
			amount: 2_100_000, // 200 regular of lava zone
			requiredRank: 8,
		},
		color: Color3.fromRGB(87, 122, 245),
	},

	// zone 9
	"Toxic Lands": {
		id: 11,
		npcs: [BAN_LAND_NPCS.toxicSparkletimeKing, BAN_LAND_NPCS.toxicWastelander],
		cost: {
			currency: "coins",
			amount: 5_000_000,
			requiredRank: 9,
		},
		color: Color3.fromRGB(66, 250, 10),
	},

	// zone 9
	"Jester Castle": {
		id: 12,
		npcs: [BAN_LAND_NPCS.neonJester, BAN_LAND_NPCS.prince],
		cost: {
			currency: "coins",
			amount: 13_500_000,
			requiredRank: 10,
		},
		color: Color3.fromRGB(247, 166, 99),
	},

	// zone 10 (Emerald)
	// zone 11 (Draconic)
	// zone 12 (Pendulum)
});
