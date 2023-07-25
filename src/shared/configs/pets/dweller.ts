import { Pet } from ".";

/**
 * Divine egg (Limited).
 */
export const DWELLER_EGG_PETS: Record<string, Pet> = {
	Siphon: {
		chance: 75,
		id: 124,
		rarity: "Exclusive",
		fusionCost: 10000,
		stats: {
			additionalDamage: 5500,
			additionalBans: 300,
		},
	},
	"Darkness Phoenix": {
		chance: 20,
		id: 125,
		rarity: "Exclusive",
		fusionCost: 20000,
		stats: {
			additionalDamage: 10000,
			additionalBans: 450,
		},
	},
	"Deadly Dark Dominus": {
		chance: 3.5,
		id: 126,
		rarity: "Exclusive",
		fusionCost: 30000,
		stats: {
			additionalDamage: 14500,
			additionalBans: 950,
		},
	},
	Mida: {
		chance: 1.5,
		id: 127,
		rarity: "Exclusive",
		fusionCost: 30000,
		stats: {
			additionalDamage: 25000,
			additionalBans: 1500,
		},
	},
};
