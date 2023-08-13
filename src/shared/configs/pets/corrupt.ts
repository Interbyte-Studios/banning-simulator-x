import { Pet } from ".";

/**
 * Corrupt egg.
 */
export const CORRUPT_EGG_PETS: Record<string, Pet> = {
	"Corrupt Doggy": {
		chance: 38.37995,
		id: 63,
		rarity: "Basic",
		stats: {
			additionalDamage: 150_000,
			additionalBans: 335,
		},
	},
	"Corrupt Bunny": {
		chance: 30,
		id: 64,
		rarity: "Basic",
		stats: {
			additionalDamage: 150_000,
			additionalBans: 335,
		},
	},
	"Corrupt Bear": {
		chance: 20,
		id: 65,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 350_000,
			additionalBans: 400,
		},
	},
	"Corrupt Deer": {
		chance: 10,
		id: 66,
		rarity: "Rare",
		stats: {
			additionalDamage: 500_000,
			additionalBans: 550,
		},
	},
	"Corrupt Pegasus": {
		chance: 1,
		id: 67,
		rarity: "Epic",
		stats: {
			additionalDamage: 1_000_000,
			additionalBans: 625,
		},
	},
	"Corrupt Demon": {
		chance: 0.5,
		id: 68,
		rarity: "Epic",
		stats: {
			additionalDamage: 1_150_000,
			additionalBans: 700,
		},
	},
	"Corrupt Hyperhalo": {
		chance: 0.1,
		id: 69,
		rarity: "Epic",
		stats: {
			additionalDamage: 1_250_000,
			additionalBans: 800,
		},
	},
	"Corrupt Duke": {
		chance: 0.02,
		id: 70,
		rarity: "Legendary",
		stats: {
			additionalDamage: 2_500_000,
			additionalBans: 950,
		},
	},
	"Corrupted Titan": {
		chance: 0.01,
		id: 71,
		rarity: "Legendary",
		stats: {
			additionalDamage: 3_750_000,
			additionalBans: 1_250,
		},
	},
	"Corrupted Overseer": {
		chance: 0.00001,
		id: 72,
		rarity: "Primordial",
		stats: {
			additionalDamage: 50_500_000,
			additionalBans: 12_500,
		},
	},
};
