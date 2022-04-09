import { Currency } from "../currencies";

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
	 * The display name of the zone.
	 */
	name: string;
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
