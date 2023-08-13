import { t } from "@rbxts/t";

import { Currency } from "../currencies";
import { WorldName } from "../worlds";
import { BAN_LAND_NPCS } from "./npcs/banLand";
import { CYBER_CITY_NPCS } from "./npcs/cyberCities";

export interface Npc {
	name: string;
	health: number;
	reward: {
		bans: number;
		currency: number;
		currencyType: Currency;
		experience: number;
	};
	rank: number;
	isBoss: boolean;
	damage?: number;
}

export interface Zone {
	// The world the zone belongs too.
	worldParent: WorldName;

	/**
	 * The cost of the zone.
	 */
	cost?: {
		currency: Currency;
		amount: number;
		requiredRank: number;
	};

	// The color associated with the zone.
	color: Color3;

	// The id of the zone.
	id: number;

	// The npcs in the zone.
	npcs: Array<Npc>;
}

export const isZoneName = t.literal(
	"Forest",
	"Desert",
	"Sunflower Field",
	"Honeycomb",
	"Ice Land",
	"Beach",
	"Candy Land",
	"The Mines",
	"Lava Lands",
	"Enchanted Forest",
	"Toxic Lands",
	"Jester Castle",
	"Neon City",
	"Electric Center",
	"Neon District",
	"Cybershroom Forest",
	"Malware Mayhem",
	"UFO Valley",
	"Holographic Musuem",
	"B1n4ry Z0n3",
	"Cortex",
	"Lunar Realm",
);
export type ZoneNames = t.static<typeof isZoneName>;

export const isStarterZone = t.literal("Forest", "Neon City");
export type StarterZone = t.static<typeof isStarterZone>;

export const zones: Record<ZoneNames, Zone> = {
	// zone 1
	Forest: {
		id: 1,
		worldParent: "Ban Land",
		npcs: [BAN_LAND_NPCS.forestWizard, BAN_LAND_NPCS.mushroomKing],
		cost: undefined,
		color: Color3.fromRGB(37, 135, 43),
	},

	// zone 2
	Desert: {
		id: 2,
		worldParent: "Ban Land",
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
		worldParent: "Ban Land",
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
		worldParent: "Ban Land",
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
		worldParent: "Ban Land",
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
		worldParent: "Ban Land",
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
		worldParent: "Ban Land",
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
		worldParent: "Ban Land",
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
		worldParent: "Ban Land",
		npcs: [BAN_LAND_NPCS.lavaLord, BAN_LAND_NPCS.headlessDoombringer],
		cost: {
			currency: "coins",
			amount: 1_500_000,
			requiredRank: 7,
		},
		color: Color3.fromRGB(213, 115, 61),
	},

	// zone 10
	"Enchanted Forest": {
		id: 10,
		worldParent: "Ban Land",
		npcs: [BAN_LAND_NPCS.enchantedGolem, BAN_LAND_NPCS.udzal],
		cost: {
			currency: "coins",
			amount: 2_100_000, // 200 regular of lava zone
			requiredRank: 8,
		},
		color: Color3.fromRGB(87, 122, 245),
	},

	// zone 11
	"Toxic Lands": {
		id: 11,
		worldParent: "Ban Land",
		npcs: [BAN_LAND_NPCS.toxicSparkletimeKing, BAN_LAND_NPCS.toxicWastelander],
		cost: {
			currency: "coins",
			amount: 5_000_000,
			requiredRank: 9,
		},
		color: Color3.fromRGB(66, 250, 10),
	},

	// zone 12
	"Jester Castle": {
		id: 12,
		worldParent: "Ban Land",
		npcs: [BAN_LAND_NPCS.neonJester, BAN_LAND_NPCS.prince],
		cost: {
			currency: "coins",
			amount: 13_500_000,
			requiredRank: 10,
		},
		color: Color3.fromRGB(247, 166, 99),
	},

	// CYBER CITIES
	// zone 1
	"Neon City": {
		id: 13,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.RussoTalks, CYBER_CITY_NPCS.New_Item],
		cost: undefined,
		color: Color3.fromRGB(245, 148, 20),
	},

	// zone 2
	"Electric Center": {
		id: 14,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.CarbonMeister, CYBER_CITY_NPCS.LordAlpha84],
		cost: {
			currency: "cyber tokens",
			amount: 15_000,
			requiredRank: 12,
		},
		color: Color3.fromRGB(247, 94, 5),
	},

	// zone 3
	"Neon District": {
		id: 15,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.RealYouTube_AlphaGG, CYBER_CITY_NPCS.lighthamer],
		cost: {
			currency: "cyber tokens",
			amount: 45_000,
			requiredRank: 13,
		},
		color: Color3.fromRGB(235, 13, 242),
	},

	// zone 4
	"Cybershroom Forest": {
		id: 16,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.SonsofFun_YT, CYBER_CITY_NPCS.Not_Nert],
		cost: {
			currency: "cyber tokens",
			amount: 135_000,
			requiredRank: 14,
		},
		color: Color3.fromRGB(51, 247, 33),
	},

	// zone 5
	"Malware Mayhem": {
		id: 17,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.Cigatronix, CYBER_CITY_NPCS.PandaBoss3_0],
		cost: {
			currency: "cyber tokens",
			amount: 405_000,
			requiredRank: 15,
		},
		color: Color3.fromRGB(232, 20, 20),
	},

	// zone 6
	"UFO Valley": {
		id: 18,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.Emulsifies, CYBER_CITY_NPCS.Blizzyrd],
		cost: {
			currency: "cyber tokens",
			amount: 1_215_000,
			requiredRank: 16,
		},
		color: Color3.fromRGB(20, 158, 232),
	},

	// zone 7
	"Holographic Musuem": {
		id: 19,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.OverHash, CYBER_CITY_NPCS.ObscureEntity],
		cost: {
			currency: "cyber tokens",
			amount: 3_645_000,
			requiredRank: 17,
		},
		color: Color3.fromRGB(20, 158, 232),
	},

	// zone 8
	"B1n4ry Z0n3": {
		id: 20,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.YT_FrogRoblox, CYBER_CITY_NPCS.ReGenZ_YT],
		cost: {
			currency: "cyber tokens",
			amount: 10_935_000,
			requiredRank: 18,
		},
		color: Color3.fromRGB(222, 36, 10),
	},

	// zone 9
	Cortex: {
		id: 21,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.officialJBbossplayz, CYBER_CITY_NPCS.cookieDAmain],
		cost: {
			currency: "cyber tokens",
			amount: 32_805_000,
			requiredRank: 19,
		},
		color: Color3.fromRGB(133, 245, 99),
	},

	// zone 10
	"Lunar Realm": {
		id: 22,
		worldParent: "Cyber Cities",
		npcs: [CYBER_CITY_NPCS.RemDaBomRBLX, CYBER_CITY_NPCS.SinisterGh0ulz],
		cost: {
			currency: "cyber tokens",
			amount: 98_415_000,
			requiredRank: 20,
		},
		color: Color3.fromRGB(245, 120, 250),
	},
};

/**
 * @param x The object to check.
 * @returns If the given object was a valid zone.
 */
export function isValidZone(x: unknown): x is ZoneNames {
	return zones[x as ZoneNames] !== undefined;
}
export type NPCs = keyof typeof BAN_LAND_NPCS | keyof typeof CYBER_CITY_NPCS;
