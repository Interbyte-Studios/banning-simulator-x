import { t } from "@rbxts/t";

import { Rarities, RarityGradient } from "../rarities";

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
	 * The cost of fusing the pet.
	 */
	fusionCost?: number;

	/**
	 * The stats of the pet.
	 */
	stats: {
		additionalDamage: number;
		additionalBans: number;
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
			Reflectance: 0,
		},
		Radiant_2: {
			Color: Color3.fromRGB(0, 0, 0),
			Material: Enum.Material.Glass,
			Reflectance: 0,
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

export const VARIANT_GRADIENTS = {
	regular: {
		id: 1,
		reverseId: 3,
		maxFusions: 0,
		betterMaxFusions: 0,
		BeginningColor: Color3.fromRGB(255, 255, 255),
		EndingColor: Color3.fromRGB(148, 148, 148),
		SpecialColor: undefined,
	},
	void: {
		id: 2,
		reverseId: 2,
		maxFusions: 0,
		betterMaxFusions: 0,
		BeginningColor: Color3.fromRGB(98, 37, 209),
		EndingColor: Color3.fromRGB(57, 0, 86),
		SpecialColor: undefined,
	},
	radiant: {
		id: 3,
		reverseId: 1,
		maxFusions: 0,
		betterMaxFusions: 0,
		BeginningColor: Color3.fromRGB(255, 255, 255),
		EndingColor: Color3.fromRGB(250, 196, 61),
		SpecialColor: undefined,
	},
} satisfies Record<Variants, RarityGradient>;
export type VariantGradients = keyof typeof VARIANT_GRADIENTS;

export const PET_MAX_LEVELS = {
	regular: 30,
	void: 40,
	radiant: 50,
};

// Amount of bans required per level
export const PET_LEVEL_REQUIREMENTS = {
	regular: 30,
	void: 45,
	radiant: 72,
};
