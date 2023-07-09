import { Pet } from ".";

/**
 * Candy egg.
 */
export const WORLD_PRESTIGE_PETS: Record<string, Pet> = {
	"Hellfire Infernum": {
		chance: 0,
		id: 15000,
		rarity: "Legendary",
		stats: {
			additionalDamage: 12500,
			additionalBans: 330,
		},
	},
	"Hellfire Ball": {
		chance: 0,
		id: 15001,
		rarity: "Legendary",
		stats: {
			additionalDamage: 17500,
			additionalBans: 450,
		},
	},
	"Hellfire Hound": {
		chance: 0,
		id: 15002,
		rarity: "Legendary",
		stats: {
			additionalDamage: 25000,
			additionalBans: 600,
		},
	},
	Hychampion: {
		chance: 0,
		id: 15003,
		rarity: "Legendary",
		stats: {
			additionalDamage: 35000,
			additionalBans: 850,
		},
	},
	"Hellfire Dragon": {
		chance: 0,
		id: 15004,
		rarity: "Exclusive",
		stats: {
			additionalDamage: 60000,
			additionalBans: 2000,
		},
	},
};
