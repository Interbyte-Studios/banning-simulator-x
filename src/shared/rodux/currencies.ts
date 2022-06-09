import Object from "@rbxts/object-utils";
import Rodux from "@rbxts/rodux";
import { currencies, Currency } from "shared/configs/currencies";
import { getEggCost } from "shared/util/getEggCost";

import { AddPet } from "./pets";
import { PurchaseWeapon } from "./weapons";
import { UnlockWorld, UnlockZone } from "./worlds";

export type CurrenciesState = { [P in Currency]: number };
export type CurrenciesActions = KillNpc;

export interface KillNpc extends Rodux.Action<"killNpc"> {
	currency: number;
	currencyType: Currency;
	experience: number;
	weaponId: number;
}

/**
 * @param currencyAmount The amount of currency to reward the player with.
 * @param currencyType The type of currency to reward the player with.
 * @param experience The amount of experience to give them.
 * @param weaponId The id of the weapon the player has equipped.
 * @returns The Rodux action to dispatch.
 */
export function killNpc(
	currencyAmount: number,
	currencyType: Currency,
	experience: number,
	weaponId: number,
): KillNpc & Rodux.AnyAction {
	return {
		type: "killNpc",
		currency: currencyAmount,
		currencyType,
		experience,
		weaponId,
	};
}

// start with 0 currency
const defaultCurrencyAmount = 1000;
const defaultCurrencies = Object.fromEntries(
	Object.values(currencies).map((currency) => [currency, defaultCurrencyAmount] as const),
);

/* eslint-disable jsdoc/require-jsdoc */
export const currenciesReducer = Rodux.createReducer<
	CurrenciesState,
	CurrenciesActions | PurchaseWeapon | UnlockWorld | UnlockZone | AddPet
>(defaultCurrencies, {
	purchaseWeapon: (state, action) => {
		const purchasedCurrency = state[action.cost.currency] - action.cost.amount;

		return { ...state, [action.cost.currency]: purchasedCurrency };
	},
	killNpc: (state, action) => {
		const increasedCurrency = state[action.currencyType] + action.currency;

		return { ...state, [action.currencyType]: increasedCurrency };
	},
	unlockWorld: (state, action) => {
		const purchasedCurrency = state[action.currencyType] - action.currency;

		return { ...state, [action.currency]: purchasedCurrency };
	},
	unlockZone: (state, action) => {
		const purchasedCurrency = state[action.currencyType] - action.currency;

		return { ...state, [action.currency]: purchasedCurrency };
	},
	addPet: (state, action) => {
		const eggData = getEggCost(action.eggName, action.variant === "void");

		const purchasedCurrency = state[eggData.currencyType] - eggData.amount;

		return { ...state, [eggData.currencyType]: purchasedCurrency };
	},
});
/* eslint-enable jsdoc/require-jsdoc */
