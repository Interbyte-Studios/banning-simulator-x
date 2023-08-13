import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { Currency } from "shared/configs/currencies";

export const rebirthMagicEggUpgrade = t.literal(1, 2, 3, 4, 5);
export type RebirthMagicEggUpgrade = t.static<typeof rebirthMagicEggUpgrade>;

export const rebirthAdditionalEggs = t.literal(1, 2);
export type RebirthAdditionalEggs = t.static<typeof rebirthAdditionalEggs>;

export const rebirthAdditionalPets = t.literal(1, 2, 3, 4);
export type RebirthAdditionalPets = t.static<typeof rebirthAdditionalPets>;

export type RebirthState = {
	rebirth: number;
	magicEggUpgrades: number;
	additionalEggs: number;
	additionalPets: number;
	currencyMultipliers: { [C in Currency]: number };
	teleport: boolean;
	fastHatch: boolean;
	extraLuck: boolean;
};
export type RebirthActions =
	| ClaimRebirth
	| PurchaseMagicEggsUpgrade
	| PurchaseAdditionalEggsUpgrade
	| PurchaseAdditionalPetsUpgrade
	| PurchaseCurrencyUpgrade
	| PurchaseTeleportUpgrade
	| PurchaseFastHatchUpgrade
	| PurchaseExtraLuckUpgrade;

export interface ClaimRebirth extends Rodux.Action<"claimRebirth"> {}
export interface PurchaseMagicEggsUpgrade extends Rodux.Action<"purchaseMagicEggsUpgrade"> {}
export interface PurchaseAdditionalEggsUpgrade extends Rodux.Action<"purchaseAdditionalEggsUpgrade"> {}
export interface PurchaseAdditionalPetsUpgrade extends Rodux.Action<"purchaseAdditionalPetsUpgrade"> {}
export interface PurchaseCurrencyUpgrade extends Rodux.Action<"purchaseCurrencyUpgrade"> {
	currency: Currency;
}
export interface PurchaseTeleportUpgrade extends Rodux.Action<"purchaseTeleportUpgrade"> {}
export interface PurchaseFastHatchUpgrade extends Rodux.Action<"purchaseFastHatchUpgrade"> {}
export interface PurchaseExtraLuckUpgrade extends Rodux.Action<"purchaseExtraLuckUpgrade"> {}

/**
 * @returns The Rodux action.
 */
export function claimRebirth(): ClaimRebirth & Rodux.AnyAction {
	return {
		type: "claimRebirth",
	};
}

/**
 * @returns The Rodux action.
 */
export function purchaseMagicEggsUpgrade(): PurchaseMagicEggsUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseMagicEggsUpgrade",
	};
}

/**
 * @returns The Rodux action.
 */
export function purchaseAdditionalEggsUpgrade(): PurchaseAdditionalEggsUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseAdditionalEggsUpgrade",
	};
}

/**
 * @returns The Rodux action.
 */
export function purchaseAdditionalPetsUpgrade(): PurchaseAdditionalPetsUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseAdditionalPetsUpgrade",
	};
}

/**
 * @param currency The Currency to purchase an upgrade for.
 * @returns The Rodux action.
 */
export function purchaseCurrencyUpgrade(currency: Currency): PurchaseCurrencyUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseCurrencyUpgrade",
		currency,
	};
}

/**
 * @returns The Rodux action.
 */
export function purchaseTeleportUpgrade(): PurchaseTeleportUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseTeleportUpgrade",
	};
}

/**
 * @returns The Rodux action.
 */
export function purchaseFastHatchUpgrade(): PurchaseFastHatchUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseFastHatchUpgrade",
	};
}

/**
 * @returns The Rodux action.
 */
export function purchaseExtraLuckUpgrade(): PurchaseExtraLuckUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseExtraLuckUpgrade",
	};
}

export const defaultRebirths: RebirthState = {
	rebirth: 0,
	magicEggUpgrades: 0,
	additionalEggs: 0,
	additionalPets: 0,
	currencyMultipliers: {
		coins: 0,
		gears: 0,
		"cyber tokens": 0,
		gems: 0,
	},
	teleport: false,
	fastHatch: false,
	extraLuck: false,
};

/* eslint-disable jsdoc/require-jsdoc */
export const rebirthsReducer = Rodux.createReducer<RebirthState, RebirthActions>(defaultRebirths, {
	claimRebirth: (state) => {
		return {
			...state,
			rebirth: state.rebirth + 1,
		};
	},
	purchaseMagicEggsUpgrade: (state) => {
		return {
			...state,
			magicEggUpgrades: state.magicEggUpgrades + 1,
		};
	},
	purchaseAdditionalEggsUpgrade: (state) => {
		return {
			...state,
			additionalEggs: state.additionalEggs + 1,
		};
	},
	purchaseAdditionalPetsUpgrade: (state) => {
		return {
			...state,
			additionalPets: state.additionalPets + 1,
		};
	},
	purchaseCurrencyUpgrade: (state, action) => {
		return {
			...state,
			currencyMultipliers: {
				...state.currencyMultipliers,
				[action.currency]: state.currencyMultipliers[action.currency] + 1,
			},
		};
	},
	purchaseTeleportUpgrade: (state) => {
		return {
			...state,
			teleport: true,
		};
	},
	purchaseFastHatchUpgrade: (state) => {
		return {
			...state,
			fastHatch: true,
		};
	},
	purchaseExtraLuckUpgrade: (state) => {
		return {
			...state,
			extraLuck: true,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
