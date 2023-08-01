import { Pet } from ".";

/**
 * Divine egg (Limited).
 */
export const DWELLER_EGG_PETS: Record<string, Pet> = {
	Siphon: {
		chance: 75,
		id: 124,
		rarity: "Exclusive",
		fusionCost: 125_000,
		stats: {
			additionalDamage: 5500,
			additionalBans: 275,
		},
	},
	"Darkness Phoenix": {
		chance: 20,
		id: 125,
		rarity: "Exclusive",
		fusionCost: 500_000,
		stats: {
			additionalDamage: 10000,
			additionalBans: 350,
		},
	},
	"Deadly Dark Dominus": {
		chance: 3.5,
		id: 126,
		rarity: "Exclusive",
		fusionCost: 2_000_000,
		stats: {
			additionalDamage: 14500,
			additionalBans: 700,
		},
	},
	Mida: {
		chance: 1.5,
		id: 127,
		rarity: "Exclusive",
		fusionCost: 7_500_000,
		stats: {
			additionalDamage: 25000,
			additionalBans: 1400,
		},
	},
};
