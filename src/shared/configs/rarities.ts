import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

export interface RarityGradient {
	id: number;
	BeginningColor: Color3;
	EndingColor: Color3;
	SpecialColor: ColorSequence | undefined;
}

export const RARITIES = preserveWithConstraint<Record<string, RarityGradient>>()({
	Basic: {
		id: 1,
		BeginningColor: Color3.fromRGB(210, 255, 212),
		EndingColor: Color3.fromRGB(12, 255, 0),
		SpecialColor: undefined,
	},
	Ordinary: {
		id: 2,
		BeginningColor: Color3.fromRGB(253, 179, 255),
		EndingColor: Color3.fromRGB(255, 8, 243),
		SpecialColor: undefined,
	},
	Rare: {
		id: 3,
		BeginningColor: Color3.fromRGB(255, 250, 184),
		EndingColor: Color3.fromRGB(255, 238, 55),
		SpecialColor: undefined,
	},
	Epic: {
		id: 4,
		BeginningColor: Color3.fromRGB(255, 184, 184),
		EndingColor: Color3.fromRGB(255, 0, 0),
		SpecialColor: undefined,
	},
	Legendary: {
		id: 5,
		BeginningColor: Color3.fromRGB(200, 198, 255),
		EndingColor: Color3.fromRGB(21, 0, 255),
		SpecialColor: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 198, 82)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(238, 255, 83)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 169, 21)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 85, 0)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 169, 21)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(238, 255, 83)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 198, 82)),
		]),
	},
	Prismatic: {
		id: 6,
		BeginningColor: Color3.fromRGB(255, 222, 222),
		EndingColor: Color3.fromRGB(255, 62, 62),
		SpecialColor: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(160, 255, 133)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(53, 255, 8)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(209, 255, 0)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(250, 170, 0)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(209, 255, 0)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(53, 255, 8)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(160, 255, 133)),
		]),
	},
	Primordial: {
		id: 7,
		BeginningColor: Color3.fromRGB(255, 185, 186),
		EndingColor: Color3.fromRGB(255, 186, 12),
		SpecialColor: new ColorSequence([
			new ColorSequenceKeypoint(0, Color3.fromRGB(255, 0, 127)),
			new ColorSequenceKeypoint(0.15, Color3.fromRGB(255, 170, 255)),
			new ColorSequenceKeypoint(0.4, Color3.fromRGB(255, 0, 255)),
			new ColorSequenceKeypoint(0.5, Color3.fromRGB(255, 0, 0)),
			new ColorSequenceKeypoint(0.6, Color3.fromRGB(255, 0, 255)),
			new ColorSequenceKeypoint(0.85, Color3.fromRGB(255, 170, 255)),
			new ColorSequenceKeypoint(1, Color3.fromRGB(255, 0, 127)),
		]),
	},
});
export type Rarities = keyof typeof RARITIES;
