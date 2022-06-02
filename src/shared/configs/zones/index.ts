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

	npcs: Array<Npc>;
}

export type ZoneNames = keyof typeof BAN_LAND_ZONES;
export type Zones = typeof BAN_LAND_ZONES;

export type NPCs = keyof typeof BAN_LAND_NPCS;
