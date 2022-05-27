import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Rarities } from "./rarities";

export interface Pet {
	/**
	 * The chance of the pet (0 - 100).
	 */
	chance: number;

	/**
	 * The id of the pet.
	 */
	id: number;

	/**
	 * The rarity of the pet.
	 */
	rarity: Rarities;

	/**
	 * The stats of the pet.
	 */
	stats: {
		damageMultiplier: number;
		enchants?: Array<undefined>;
	};
}

/**
 * Starter egg.
 */
export const STARTER_EGG_PETS = preserveWithConstraint<Record<string, Pet>>()({
	Doggy: {
		chance: 30,
		id: 1,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	Bunny: {
		chance: 25,
		id: 2,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	Kitty: {
		chance: 25,
		id: 3,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	Piggy: {
		chance: 16,
		id: 4,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	Deer: {
		chance: 3.5,
		id: 5,
		rarity: "Ordinary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Royal Bunny": {
		chance: 0.5,
		id: 6,
		rarity: "Rare",
		stats: {
			damageMultiplier: 1,
		},
	},
});

/**
 * Desert egg.
 */
export const DESERT_EGG_PETS = preserveWithConstraint<Record<string, Pet>>()({
	"Desert Demon": {
		chance: 25,
		id: 7,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Desert Pegasus": {
		chance: 25,
		id: 8,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Desert Ram": {
		chance: 25,
		id: 9,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Desert Angel": {
		chance: 15,
		id: 10,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Desert Dragon": {
		chance: 7.5,
		id: 11,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Desert Spider": {
		chance: 1.7,
		id: 12,
		rarity: "Ordinary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Desert Wraith": {
		chance: 0.5,
		id: 13,
		rarity: "Rare",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Desert Scorpilord": {
		chance: 0.3,
		id: 14,
		rarity: "Rare",
		stats: {
			damageMultiplier: 1,
		},
	},
});

/**
 * Honeycomb egg.
 */
export const HONEYCOMB_EGG_PETS = preserveWithConstraint<Record<string, Pet>>()({
	"Desert Demon": {
		chance: 30,
		id: 15,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Doggy bee": {
		chance: 30,
		id: 16,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Dinosaur Bee": {
		chance: 15,
		id: 17,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Evil Bee": {
		chance: 15,
		id: 18,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Bunny Bee": {
		chance: 6.75,
		id: 19,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Honey Bee": {
		chance: 1.8,
		id: 20,
		rarity: "Ordinary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Pegasus Bee": {
		chance: 1.2,
		id: 21,
		rarity: "Ordinary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Queen Bee": {
		chance: 0.2,
		id: 22,
		rarity: "Rare",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Mystical Bee": {
		chance: 0.05,
		id: 23,
		rarity: "Legendary",
		stats: {
			damageMultiplier: 1,
		},
	},
});

/**
 * Candy egg.
 */
export const CANDY_EGG_PETS = preserveWithConstraint<Record<string, Pet>>()({
	"Gummy Doggy": {
		chance: 35,
		id: 24,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Gummy Bunny": {
		chance: 25,
		id: 25,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Gummy Kitty": {
		chance: 25,
		id: 26,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Gummy Bear": {
		chance: 8.98495,
		id: 27,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	Gumdrop: {
		chance: 2.2,
		id: 28,
		rarity: "Ordinary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Gummy Bee": {
		chance: 2,
		id: 29,
		rarity: "Ordinary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Gummy Dragon": {
		chance: 1.8,
		id: 30,
		rarity: "Ordinary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Gummy Striker": {
		chance: 0.01,
		id: 31,
		rarity: "Legendary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Gummy Wyvern": {
		chance: 0.005,
		id: 32,
		rarity: "Legendary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Ice Cream Pop": {
		chance: 0.00005,
		id: 33,
		rarity: "Prismatic",
		stats: {
			damageMultiplier: 1,
		},
	},
});

/**
 * Molten egg.
 */
export const MOLTEN_EGG_PETS = preserveWithConstraint<Record<string, Pet>>()({
	"Molten Doggy": {
		chance: 32.69498,
		id: 34,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Molten Bunny": {
		chance: 22,
		id: 35,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Molten Kitty": {
		chance: 21.5,
		id: 36,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Molten Squirrel": {
		chance: 21.5,
		id: 37,
		rarity: "Basic",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Molten Pegasus": {
		chance: 1.2,
		id: 38,
		rarity: "Ordinary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Molten Blob": {
		chance: 0.8,
		id: 39,
		rarity: "Ordinary",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Molten Wraith": {
		chance: 0.2,
		id: 40,
		rarity: "Rare",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Molten Leviathan": {
		chance: 0.1,
		id: 41,
		rarity: "Rare",
		stats: {
			damageMultiplier: 1,
		},
	},
	"Molten Destroyer": {
		chance: 0.005,
		id: 42,
		rarity: "Legendary",
		stats: {
			damageMultiplier: 1,
		},
	},
	Coreye: {
		chance: 0.00002,
		id: 43,
		rarity: "Prismatic",
		stats: {
			damageMultiplier: 1,
		},
	},
});
