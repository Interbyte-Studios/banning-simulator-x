import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Pet } from ".";

/**
 * Starter egg.
 */
export const STARTER_EGG_PETS = preserveWithConstraint<Record<string, Pet>>()({
	Doggy: {
		chance: 30,
		id: 1,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	Bunny: {
		chance: 25,
		id: 2,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	Kitty: {
		chance: 25,
		id: 3,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	Piggy: {
		chance: 16,
		id: 4,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	Deer: {
		chance: 3.5,
		id: 5,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 1,
		},
	},
	"Royal Bunny": {
		chance: 0.5,
		id: 6,
		rarity: "Rare",
		stats: {
			additionalDamage: 1,
		},
	},
});
