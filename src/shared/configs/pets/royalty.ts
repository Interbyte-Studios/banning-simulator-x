import { Pet } from ".";

/**
 * Royalty egg (Limited).
 */
export const ROYALTY_EGG_PETS: Record<string, Pet> = {
	"Royal Dragon": {
		chance: 75,
		id: 44,
		rarity: "Rare",
		fusionCost: 20000,
		stats: {
			additionalDamage: 375,
		},
	},
	"Royal Pegasus": {
		chance: 23,
		id: 45,
		rarity: "Epic",
		fusionCost: 24500,
		stats: {
			additionalDamage: 475,
		},
	},
	"Prime Royal": {
		chance: 2,
		id: 46,
		rarity: "Legendary",
		fusionCost: 28000,
		stats: {
			additionalDamage: 800,
		},
	},
};
