import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Pet } from ".";

/**
 * Molten egg.
 */
export const MOLTEN_EGG_PETS = preserveWithConstraint<Record<string, Pet>>()({
	"Molten Doggy": {
		chance: 32.69498,
		id: 34,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	"Molten Bunny": {
		chance: 22,
		id: 35,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	"Molten Kitty": {
		chance: 21.5,
		id: 36,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	"Molten Squirrel": {
		chance: 21.5,
		id: 37,
		rarity: "Basic",
		stats: {
			additionalDamage: 1,
		},
	},
	"Molten Pegasus": {
		chance: 1.2,
		id: 38,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 1,
		},
	},
	"Molten Blob": {
		chance: 0.8,
		id: 39,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 1,
		},
	},
	"Molten Wraith": {
		chance: 0.2,
		id: 40,
		rarity: "Rare",
		stats: {
			additionalDamage: 1,
		},
	},
	"Molten Leviathan": {
		chance: 0.1,
		id: 41,
		rarity: "Rare",
		stats: {
			additionalDamage: 1,
		},
	},
	"Molten Destroyer": {
		chance: 0.005,
		id: 42,
		rarity: "Legendary",
		stats: {
			additionalDamage: 1,
		},
	},
	Coreye: {
		chance: 0.00002,
		id: 43,
		rarity: "Prismatic",
		stats: {
			additionalDamage: 1,
		},
	},
});
