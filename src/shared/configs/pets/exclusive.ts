import { Pet } from ".";

/**
 * Exclusive pets (Limited).
 */
export const EXCLUSIVE_PETS: Record<string, Pet> = {
	"Quiet Angel": {
		chance: 0,
		id: 10003,
		rarity: "Epic",
		fusionCost: 100,
		stats: {
			additionalDamage: 40,
		},
	},
	Seekstress: {
		chance: 0,
		id: 10004,
		rarity: "Legendary",
		fusionCost: 1000,
		stats: {
			additionalDamage: 125,
		},
	},
	PeaceKeeper: {
		chance: 0,
		id: 10005,
		rarity: "Legendary",
		fusionCost: 20000,
		stats: {
			additionalDamage: 1250,
		},
	},
};
