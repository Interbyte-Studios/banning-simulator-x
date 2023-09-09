import { Pet } from ".";

/**
 * Divine egg (Limited).
 */
export const DWELLER_EGG_PETS: Array<Pet> = [
	{
		name: "Siphon",
		chance: 75,
		id: 124,
		rarity: "Exclusive",
		fusionCost: 125_000,
		stats: {
			additionalDamage: 5500,
			additionalBans: 300,
		},
	},
	{
		name: "Darkness Phoenix",
		chance: 20,
		id: 125,
		rarity: "Exclusive",
		fusionCost: 500_000,
		stats: {
			additionalDamage: 10000,
			additionalBans: 450,
		},
	},
	{
		name: "Deadly Dark Dominus",
		chance: 3.5,
		id: 126,
		rarity: "Exclusive",
		fusionCost: 2_000_000,
		stats: {
			additionalDamage: 14500,
			additionalBans: 675,
		},
	},
	{
		name: "Mida",
		chance: 1.5,
		id: 127,
		rarity: "Exclusive",
		fusionCost: 7_500_000,
		stats: {
			additionalDamage: 25000,
			additionalBans: 1100,
		},
	},
];
