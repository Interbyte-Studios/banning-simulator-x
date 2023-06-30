import { Pet } from ".";

/**
 * Desert egg.
 */
export const DESERT_EGG_PETS: Record<string, Pet> = {
	"Desert Demon": {
		chance: 25,
		id: 7,
		rarity: "Basic",
		stats: {
			additionalDamage: 8,
			additionalBans: 4,
		},
	},
	"Desert Pegasus": {
		chance: 25,
		id: 8,
		rarity: "Basic",
		stats: {
			additionalDamage: 8,
			additionalBans: 4,
		},
	},
	"Desert Ram": {
		chance: 25,
		id: 9,
		rarity: "Basic",
		stats: {
			additionalDamage: 8,
			additionalBans: 4,
		},
	},
	"Desert Angel": {
		chance: 15,
		id: 10,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 14,
			additionalBans: 6,
		},
	},
	"Desert Dragon": {
		chance: 7.5,
		id: 11,
		rarity: "Rare",
		stats: {
			additionalDamage: 18,
			additionalBans: 8,
		},
	},
	"Desert Spider": {
		chance: 1.7,
		id: 12,
		rarity: "Epic",
		stats: {
			additionalDamage: 23,
			additionalBans: 10,
		},
	},
	"Desert Wraith": {
		chance: 0.5,
		id: 13,
		rarity: "Epic",
		stats: {
			additionalDamage: 24,
			additionalBans: 10,
		},
	},
	"Desert Scorpilord": {
		chance: 0.3,
		id: 14,
		rarity: "Legendary",
		stats: {
			additionalDamage: 30,
			additionalBans: 15,
		},
	},
};
