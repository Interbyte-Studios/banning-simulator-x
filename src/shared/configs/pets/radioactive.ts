import { Pet } from ".";

/**
 * Radioactive Egg (Limited).
 */
export const RADIOACTIVE_EGG_PETS: Array<Pet> = [
	{
		name: "Radioactive Imp",
		chance: 75,
		id: 83,
		rarity: "Exclusive",
		fusionCost: 50000,
		stats: {
			additionalDamage: 4500,
			additionalBans: 225,
		},
	},
	{
		name: "Radioactive Phoenix",
		chance: 20,
		id: 84,
		rarity: "Exclusive",
		fusionCost: 75000,
		stats: {
			additionalDamage: 6500,
			additionalBans: 285,
		},
	},
	{
		name: "Radioactive Vision",
		chance: 5,
		id: 85,
		rarity: "Exclusive",
		fusionCost: 100000,
		stats: {
			additionalDamage: 8200,
			additionalBans: 350,
		},
	},
];
