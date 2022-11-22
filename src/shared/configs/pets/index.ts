import { t } from "@rbxts/t";

import { Rarities } from "../rarities";

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
		additionalDamage: number;
	};
}

/**
 * Tags for creating pets.
 */
export const TAG_CONFIG = {
	Void: {
		Void_1: {
			Color: Color3.fromRGB(17, 17, 17),
			Material: Enum.Material.SmoothPlastic,
		},
		Void_2: {
			Color: Color3.fromRGB(57, 0, 86),
			Material: Enum.Material.Neon,
		},
		Void_3: {
			Color: Color3.fromRGB(108, 0, 167),
			Material: Enum.Material.Neon,
		},
		Void_Outline: {
			Color: Color3.fromRGB(98, 37, 209),
			Material: Enum.Material.Neon,
		},
	},
	Radiant: {
		Radiant_1: {
			Color: Color3.fromRGB(231, 231, 236),
			Material: Enum.Material.SmoothPlastic,
			Reflectance: -0.75,
		},
		Radiant_2: {
			Color: Color3.fromRGB(255, 191, 161),
			Material: Enum.Material.SmoothPlastic,
			Reflectance: -0.5,
		},
		Radiant_Outline: {
			Color: Color3.fromRGB(0, 0, 0),
			Material: Enum.Material.Neon,
		},
	},
};

/**
 * The default inventory size someone's allowed.
 */
export const DEFAULT_INVENTORY_SIZE = 100;

/**
 * The default amount of pets a player can equip at once.
 */
export const DEFAULT_EQUIP_AMOUNT = 4;

/**
 * The different types of pet variants in the game.
 */
export const isVariant = t.literal("regular", "void", "radiant");
export type Variants = t.static<typeof isVariant>;
