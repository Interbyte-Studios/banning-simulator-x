import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

export interface Rarity {
	Color1: Color3;
	Color2: Color3;
}

export const RARITIES = preserveWithConstraint<Record<string, Rarity>>()({
	Basic: {
		Color1: Color3.fromRGB(210, 255, 212),
		Color2: Color3.fromRGB(12, 255, 0),
	},
	Ordinary: {
		Color1: Color3.fromRGB(253, 179, 255),
		Color2: Color3.fromRGB(255, 8, 243),
	},
	Rare: {
		Color1: Color3.fromRGB(255, 250, 184),
		Color2: Color3.fromRGB(255, 238, 55),
	},
	Legendary: {
		Color1: Color3.fromRGB(200, 198, 255),
		Color2: Color3.fromRGB(21, 0, 255),
	},
	Primordial: {
		Color1: Color3.fromRGB(255, 185, 186),
		Color2: Color3.fromRGB(255, 186, 12),
	},
	Prismatic: {
		Color1: Color3.fromRGB(255, 222, 222),
		Color2: Color3.fromRGB(255, 62, 62),
	},
});
export type Rarities = keyof typeof RARITIES;
