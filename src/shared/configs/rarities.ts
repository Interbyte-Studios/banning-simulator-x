import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

export interface RarityGradient {
	BeginningColor: Color3;
	EndingColor: Color3;
}

export const RARITIES = preserveWithConstraint<Record<string, RarityGradient>>()({
	Basic: {
		BeginningColor: Color3.fromRGB(210, 255, 212),
		EndingColor: Color3.fromRGB(12, 255, 0),
	},
	Ordinary: {
		BeginningColor: Color3.fromRGB(253, 179, 255),
		EndingColor: Color3.fromRGB(255, 8, 243),
	},
	Rare: {
		BeginningColor: Color3.fromRGB(255, 250, 184),
		EndingColor: Color3.fromRGB(255, 238, 55),
	},
	Epic: {
		BeginningColor: Color3.fromRGB(255, 184, 184),
		EndingColor: Color3.fromRGB(255, 0, 0),
	},
	Legendary: {
		BeginningColor: Color3.fromRGB(200, 198, 255),
		EndingColor: Color3.fromRGB(21, 0, 255),
	},
	Primordial: {
		BeginningColor: Color3.fromRGB(255, 185, 186),
		EndingColor: Color3.fromRGB(255, 186, 12),
	},
	Prismatic: {
		BeginningColor: Color3.fromRGB(255, 222, 222),
		EndingColor: Color3.fromRGB(255, 62, 62),
	},
});
export type Rarities = keyof typeof RARITIES;
