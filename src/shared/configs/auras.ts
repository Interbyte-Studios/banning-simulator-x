import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { Currency } from "./currencies";

interface Aura {
	cost: {
		requiredRank?: number;
		currency: Currency;
		amount: number;
	};

	currencyMultiplier: {
		currency: Currency;
		multiplier: number;
	};

	walkSpeedMultiplier: number;
}

/**
 * Used to allow generic identities that align with a given type.
 *
 * @returns Any object that extends the given generic type when function is called.
 */
function preserveWithConstraint<X>(): <T extends X>(value: T) => T {
	return <T extends X>(value: T) => {
		return value;
	};
}

export const AURAS = preserveWithConstraint<Record<string, Aura>>()({
	Electric: {
		cost: {
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("10k"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.1,
		},

		walkSpeedMultiplier: 1.05,
	},
	"Blue Sparkle": {
		cost: {
			requiredRank: 2,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("40k"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.15,
		},

		walkSpeedMultiplier: 1.1,
	},
	Leaf: {
		cost: {
			requiredRank: 4,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("200k"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.2,
		},

		walkSpeedMultiplier: 1.15,
	},
	Sparks: {
		cost: {
			requiredRank: 6,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("1M"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.25,
		},

		walkSpeedMultiplier: 1.2,
	},
	"Red Poison": {
		cost: {
			requiredRank: 8,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("5M"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.3,
		},

		walkSpeedMultiplier: 1.25,
	},
	"Blue Fire": {
		cost: {
			requiredRank: 10,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("20M"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.35,
		},

		walkSpeedMultiplier: 1.3,
	},
	Fire: {
		cost: {
			requiredRank: 10,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("30M"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.4,
		},

		walkSpeedMultiplier: 1.35,
	},
	"Faint Glow": {
		cost: {
			requiredRank: 12,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("100M"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.45,
		},

		walkSpeedMultiplier: 1.4,
	},
	Sparkle: {
		cost: {
			requiredRank: 12,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("180M"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.5,
		},

		walkSpeedMultiplier: 1.45,
	},
	"Dark Aura": {
		cost: {
			requiredRank: 14,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("750M"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.55,
		},

		walkSpeedMultiplier: 1.5,
	},
	"Light Aura": {
		cost: {
			requiredRank: 14,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("1B"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.6,
		},

		walkSpeedMultiplier: 1.55,
	},
	"Evil Aura": {
		cost: {
			requiredRank: 16,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("1.5B"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.65,
		},

		walkSpeedMultiplier: 1.6,
	},
	"Worldly Aura": {
		cost: {
			requiredRank: 16,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("2B"),
		},

		currencyMultiplier: {
			currency: "gold",
			multiplier: 1.7,
		},

		walkSpeedMultiplier: 1.65,
	},
});
