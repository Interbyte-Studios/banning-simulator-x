import { t } from "@rbxts/t";

export const currencies = ["coins", "gems", "gears"] as const;

export const isCurrency = t.literal(...currencies);
export type Currency = t.static<typeof isCurrency>;

export interface CurrencyGradient {
	BeginningColor: Color3;
	EndingColor: Color3;
}

export const CURRENCY_GRADIENTS = {
	coins: {
		BeginningColor: Color3.fromRGB(94, 64, 28),
		EndingColor: Color3.fromRGB(207, 140, 43),
	},
	gems: {
		BeginningColor: Color3.fromRGB(173, 82, 102),
		EndingColor: Color3.fromRGB(240, 64, 110),
	},
	gears: {
		BeginningColor: Color3.fromRGB(166, 163, 5),
		EndingColor: Color3.fromRGB(237, 235, 74),
	}
} satisfies Record<string, CurrencyGradient>;
