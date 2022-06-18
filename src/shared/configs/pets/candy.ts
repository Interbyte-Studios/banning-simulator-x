import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Pet } from ".";

/**
 * Candy egg.
 */
export const CANDY_EGG_PETS = preserveWithConstraint<Record<string, Pet>>()({
	"Gummy Doggy": {
		chance: 35,
		id: 24,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	"Gummy Bunny": {
		chance: 25,
		id: 25,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	"Gummy Kitty": {
		chance: 25,
		id: 26,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	"Gummy Bear": {
		chance: 8.98495,
		id: 27,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	Gumdrop: {
		chance: 2.2,
		id: 28,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 1,
		},
	},
	"Gummy Bee": {
		chance: 2,
		id: 29,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 1,
		},
	},
	"Gummy Dragon": {
		chance: 1.8,
		id: 30,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 1,
		},
	},
	"Gummy Striker": {
		chance: 0.01,
		id: 31,
		rarity: "Legendary",
		stats: {
			additionalDamage: 1,
		},
	},
	"Gummy Wyvern": {
		chance: 0.005,
		id: 32,
		rarity: "Legendary",
		stats: {
			additionalDamage: 1,
		},
	},
	"Ice Cream Pop": {
		chance: 0.00005,
		id: 33,
		rarity: "Prismatic",
		stats: {
			additionalDamage: 1,
		},
	},
});
