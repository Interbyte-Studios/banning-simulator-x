import { t } from "@rbxts/t";

import { Currency } from "../currencies";
import { BAN_LAND_ZONES } from "./banLand";
import { BAN_LAND_NPCS } from "./banLand/npcs";

export interface Npc {
	name: string;
	health: number;
	reward: {
		currency: number;
		experience: number;
	};
	isBoss: boolean;
	damage: number;
}

export interface Zone {
	/**
	 * The cost of the zone.
	 */
	cost?: {
		currency: Currency;
		amount: number;
		requiredRank: number;
	};

	// The id of the zone.
	id: number;

	// The npcs in the zone.
	npcs: Array<Npc>;
}

/**
 * @param x The object to check.
 * @returns If the given object was a valid zone.
 */
export function isValidZone(x: unknown): x is keyof typeof BAN_LAND_ZONES {
	return BAN_LAND_ZONES[x as keyof typeof BAN_LAND_ZONES] !== undefined;
}

export type ZoneNames = t.static<typeof isValidZone>;
export type Zones = typeof BAN_LAND_ZONES;

export type NPCs = keyof typeof BAN_LAND_NPCS;
