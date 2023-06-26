import { Pet } from ".";

/**
 * Armored egg.
 */
export const GROUP_CHEST_PETS: Record<string, Pet> = {
	Byte: {
		chance: 0,
		id: 10001,
		rarity: "Exclusive",
		fusionCost: 10000,
		stats: {
			additionalDamage: 25,
		},
	},
	"Shade Glider": {
		chance: 0,
		id: 10002,
		rarity: "Exclusive",
		fusionCost: 28000,
		stats: {
			additionalDamage: 55,
		},
	},
};
