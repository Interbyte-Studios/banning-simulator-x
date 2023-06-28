import { Pet } from ".";

/**
 * Exclusive pets (Limited).
 */
export const EXCLUSIVE_PETS: Record<string, Pet> = {
	"Quiet Angel": {
		chance: 0,
		id: 10003,
		rarity: "Exclusive",
		fusionCost: 100,
		stats: {
			additionalDamage: 40,
		},
	},
	Seekstress: {
		chance: 0,
		id: 10004,
		rarity: "Exclusive",
		fusionCost: 1000,
		stats: {
			additionalDamage: 125,
		},
	},
	PeaceKeeper: {
		chance: 0,
		id: 10005,
		rarity: "Exclusive",
		fusionCost: 20000,
		stats: {
			additionalDamage: 1250,
		},
	},
	"Developer Gummy Bunny": {
		chance: 0,
		id: 10006,
		rarity: "Exclusive",
		fusionCost: 50000000000,
		stats: {
			additionalDamage: 5000000000000000,
		},
	},
};
