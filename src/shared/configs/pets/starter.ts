import { Pet } from ".";

/**
 * Starter egg.
 */
export const STARTER_EGG_PETS: Record<string, Pet> = {
	Doggy: {
		chance: 29.5,
		id: 1,
		rarity: "Basic",
		stats: {
			additionalDamage: 2,
		},
	},
	Bunny: {
		chance: 25,
		id: 2,
		rarity: "Basic",
		stats: {
			additionalDamage: 2,
		},
	},
	Kitty: {
		chance: 25,
		id: 3,
		rarity: "Basic",
		stats: {
			additionalDamage: 2,
		},
	},
	Piggy: {
		chance: 16,
		id: 4,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 4,
		},
	},
	Deer: {
		chance: 3.5,
		id: 5,
		rarity: "Rare",
		stats: {
			additionalDamage: 6,
		},
	},
	"Royal Bunny": {
		chance: 0.5,
		id: 6,
		rarity: "Epic",
		stats: {
			additionalDamage: 8,
		},
	},
};
