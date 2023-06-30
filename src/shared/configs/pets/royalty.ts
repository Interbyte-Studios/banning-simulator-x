import { Pet } from ".";

/**
 * Royalty egg (Limited).
 */
export const ROYALTY_EGG_PETS: Record<string, Pet> = {
	"Royal Dragon": {
		chance: 75,
		id: 44,
		rarity: "Exclusive",
		fusionCost: 20000,
		stats: {
			additionalDamage: 375,
			additionalBans: 30,
		},
	},
	"Royal Pegasus": {
		chance: 23,
		id: 45,
		rarity: "Exclusive",
		fusionCost: 24500,
		stats: {
			additionalDamage: 775,
			additionalBans: 80,
		},
	},
	"Prime Royal": {
		chance: 2,
		id: 46,
		rarity: "Exclusive",
		fusionCost: 28000,
		stats: {
			additionalDamage: 1350,
			additionalBans: 150,
		},
	},
};
