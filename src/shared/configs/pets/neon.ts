import { Pet } from ".";

/**
 * Neon egg (Limited).
 */
export const NEON_EGG_PETS: Record<string, Pet> = {
	"Neon Bee": {
		chance: 75,
		id: 141,
		rarity: "Exclusive",
		fusionCost: 55000,
		stats: {
			additionalDamage: 1_500_000,
			additionalBans: 550,
		},
	},
	"Neon  Imp": {
		chance: 21,
		id: 142,
		rarity: "Exclusive",
		fusionCost: 125_000,
		stats: {
			additionalDamage: 2_500_000,
			additionalBans: 950,
		},
	},
	"Neon Seekstress": {
		chance: 3.5,
		id: 143,
		rarity: "Exclusive",
		fusionCost: 175_000,
		stats: {
			additionalDamage: 3_500_000,
			additionalBans: 1_200,
		},
	},
	"Neon Cerberus": {
		chance: 0.5,
		id: 144,
		rarity: "Exclusive",
		fusionCost: 250_000,
		stats: {
			additionalDamage: 5_000_000,
			additionalBans: 2_250,
		},
	},
};
