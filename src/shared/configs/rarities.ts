import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

export interface RarityGradient {
	BeginningColor: Color3;
	EndingColor: Color3;
	SpecialColor: ColorSequence | undefined;
}

export const RARITIES = preserveWithConstraint<Record<string, RarityGradient>>()({
	Basic: {
		BeginningColor: Color3.fromRGB(210, 255, 212),
		EndingColor: Color3.fromRGB(12, 255, 0),
		SpecialColor: undefined,
	},
	Ordinary: {
		BeginningColor: Color3.fromRGB(253, 179, 255),
		EndingColor: Color3.fromRGB(255, 8, 243),
		SpecialColor: undefined,
	},
	Rare: {
		BeginningColor: Color3.fromRGB(255, 250, 184),
		EndingColor: Color3.fromRGB(255, 238, 55),
		SpecialColor: undefined,
	},
	Epic: {
		BeginningColor: Color3.fromRGB(255, 184, 184),
		EndingColor: Color3.fromRGB(255, 0, 0),
		SpecialColor: undefined,
	},
	Legendary: {
		BeginningColor: Color3.fromRGB(200, 198, 255),
		EndingColor: Color3.fromRGB(21, 0, 255),
		SpecialColor: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(127, 57, 255)),
			new ColorSequenceKeypoint(0.25, Color3.fromRGB(95, 252, 255)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(95, 252, 255)),
			new ColorSequenceKeypoint(0.75, Color3.fromRGB(95, 252, 255)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(191, 30, 255)),
		]),
	},
	Primordial: {
		BeginningColor: Color3.fromRGB(255, 185, 186),
		EndingColor: Color3.fromRGB(255, 186, 12),
		SpecialColor: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(243, 180, 183)),
			new ColorSequenceKeypoint(0.25, Color3.fromRGB(243, 113, 241)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(243, 113, 241)),
			new ColorSequenceKeypoint(0.75, Color3.fromRGB(243, 113, 241)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(243, 41, 85)),
		]),
	},
	Prismatic: {
		BeginningColor: Color3.fromRGB(255, 222, 222),
		EndingColor: Color3.fromRGB(255, 62, 62),
		SpecialColor: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 222, 222)),
			new ColorSequenceKeypoint(0.25, Color3.fromRGB(135, 233, 233)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(135, 233, 233)),
			new ColorSequenceKeypoint(0.75, Color3.fromRGB(135, 233, 233)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 222, 222)),
		]),
	},
});
export type Rarities = keyof typeof RARITIES;
