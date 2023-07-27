import { Pet } from ".";

/**
 * Divine egg (Limited).
 */
export const DIVINE_EGG_PETS: Record<string, Pet> = {
	Angel: {
		chance: 75,
		id: 97,
		rarity: "Exclusive",
		fusionCost: 10000,
		stats: {
			additionalDamage: 3500,
			additionalBans: 200,
		},
	},
	"Mother Earth": {
		chance: 20,
		id: 98,
		rarity: "Exclusive",
		fusionCost: 20000,
		stats: {
			additionalDamage: 5000,
			additionalBans: 425,
		},
	},
	"Dark Angel": {
		chance: 3.5,
		id: 99,
		rarity: "Exclusive",
		fusionCost: 30000,
		stats: {
			additionalDamage: 11500,
			additionalBans: 875,
		},
	},
	"D I V I N E": {
		chance: 1.5,
		id: 100,
		rarity: "Exclusive",
		fusionCost: 30000,
		stats: {
			additionalDamage: 20000,
			additionalBans: 1800,
		},
	},
};
