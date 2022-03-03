import Object from "@rbxts/object-utils";
import Rodux from "@rbxts/rodux";
import { currencies, Currency } from "shared/configs/currencies";

import { PurchaseWeapon } from "./weapons";

export type CurrenciesState = { [P in Currency]: number };

// start with 0 currency
const defaultCurrencyAmount = 0;
const defaultCurrencies = Object.fromEntries(
	Object.values(currencies).map((currency) => [currency, defaultCurrencyAmount] as const),
);

/* eslint-disable jsdoc/require-jsdoc */
export const currenciesReducer = Rodux.createReducer<CurrenciesState, PurchaseWeapon>(defaultCurrencies, {
	purchaseWeapon: (state, action) => {
		const purchasedCurrency = state[action.cost.currency] - action.cost.amount;

		return { ...state, [action.cost.currency]: purchasedCurrency };
	},
});
/* eslint-enable jsdoc/require-jsdoc */
