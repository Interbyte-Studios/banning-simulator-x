import { Pet } from ".";

/**
 * Starter egg.
 */
export const STARTER_EGG_PETS: Record<string, Pet> = {
	Doggy: {
		chance: 30,
		id: 1,
		rarity: "Basic",
		stats: {
			additionalDamage: 4,
			additionalBans: 1,
		},
	},
	Bunny: {
		chance: 25,
		id: 2,
		rarity: "Basic",
		stats: {
			additionalDamage: 4,
			additionalBans: 1,
		},
	},
	Kitty: {
		chance: 25,
		id: 3,
		rarity: "Basic",
		stats: {
			additionalDamage: 4,
			additionalBans: 1,
		},
	},
	Piggy: {
		chance: 16,
		id: 4,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 8,
			additionalBans: 2,
		},
	},
	Deer: {
		chance: 3.5,
		id: 5,
		rarity: "Rare",
		stats: {
			additionalDamage: 10,
			additionalBans: 3,
		},
	},
	"Royal Bunny": {
		chance: 0.5,
		id: 6,
		rarity: "Epic",
		stats: {
			additionalDamage: 12,
			additionalBans: 4,
		},
	},
};
