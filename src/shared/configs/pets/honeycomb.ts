import { Pet } from ".";

/**
 * Honeycomb egg.
 */
export const HONEYCOMB_EGG_PETS: Record<string, Pet> = {
	"Bumble Bee": {
		chance: 29.95,
		id: 15,
		rarity: "Basic",
		stats: {
			additionalDamage: 20,
			additionalBans: 8,
		},
	},
	"Doggy Bee": {
		chance: 30,
		id: 16,
		rarity: "Basic",
		stats: {
			additionalDamage: 20,
			additionalBans: 8,
		},
	},
	"Dinosaur Bee": {
		chance: 15,
		id: 17,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 28,
			additionalBans: 12,
		},
	},
	"Evil Bee": {
		chance: 15,
		id: 18,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 28,
			additionalBans: 12,
		},
	},
	"Bunny Bee": {
		chance: 6.75,
		id: 19,
		rarity: "Rare",
		stats: {
			additionalDamage: 35,
			additionalBans: 16,
		},
	},
	"Honey Bee": {
		chance: 1.8,
		id: 20,
		rarity: "Epic",
		stats: {
			additionalDamage: 45,
			additionalBans: 20,
		},
	},
	"Pegasus Bee": {
		chance: 1.2,
		id: 21,
		rarity: "Epic",
		stats: {
			additionalDamage: 50,
			additionalBans: 20,
		},
	},
	"Queen Bee": {
		chance: 0.2,
		id: 22,
		rarity: "Legendary",
		stats: {
			additionalDamage: 60,
			additionalBans: 26,
		},
	},
	"Mystical Bee": {
		chance: 0.1,
		id: 23,
		rarity: "Legendary",
		stats: {
			additionalDamage: 70,
			additionalBans: 32,
		},
	},
};
