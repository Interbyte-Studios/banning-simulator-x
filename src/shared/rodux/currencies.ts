import Object from "@rbxts/object-utils";
import Rodux from "@rbxts/rodux";
import { currencies, Currency } from "shared/configs/currencies";

import { RedeemCode } from "./media";
import { AddPet } from "./pets";
import { RedeemQuest } from "./quests";
import { PurchaseTalisman } from "./talismans";
import { PurchaseWeapon } from "./weapons";
import { UnlockWorld, UnlockZone } from "./worlds";

export type CurrenciesState = { [P in Currency]: number };
export type CurrenciesActions = KillNpc;

export interface KillNpc extends Rodux.Action<"killNpc"> {
	currency: number;
	currencyType: Currency;
	experience: number;
	weaponId: number;
	talismanId: number | undefined;
}

/**
 * @param currencyAmount The amount of currency to reward the player with.
 * @param currencyType The type of currency to reward the player with.
 * @param experience The amount of experience to give them.
 * @param weaponId The id of the weapon the player has equipped.
 * @param talismanId The id of the talisman the player has equipped.
 * @returns The Rodux action to dispatch.
 */
export function killNpc(
	currencyAmount: number,
	currencyType: Currency,
	experience: number,
	weaponId: number,
	talismanId: number | undefined,
): KillNpc & Rodux.AnyAction {
	return {
		type: "killNpc",
		currency: currencyAmount,
		currencyType,
		experience,
		weaponId,
		talismanId,
	};
}

// start with 0 currency
const defaultCurrencyAmount = 0;
const defaultCurrencies = Object.fromEntries(
	Object.values(currencies).map((currency) => [currency, defaultCurrencyAmount] as const),
);

/* eslint-disable jsdoc/require-jsdoc */
export const currenciesReducer = Rodux.createReducer<
	CurrenciesState,
	CurrenciesActions | PurchaseWeapon | UnlockWorld | UnlockZone | AddPet | RedeemQuest | PurchaseTalisman | RedeemCode
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
		const purchasedCurrency = state[action.currency.type] - action.currency.amount;

		return { ...state, [action.currency.amount]: purchasedCurrency };
	},
	unlockZone: (state, action) => {
		const purchasedCurrency = state[action.currency.type] - action.currency.amount;

		return { ...state, [action.currency.type]: purchasedCurrency };
	},
	addPet: (state, action) => {
		let purchasedCurrency = state[action.currencyType];

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const pet of action.pets) {
			purchasedCurrency -= action.cost;
		}

		return { ...state, [action.currencyType]: purchasedCurrency };
	},
	redeemQuest: (state, action) => {
		if (action.rewardType.kind !== "currency") {
			return state;
		}

		const redeemedCurrency = state[action.rewardType.currency] + action.rewardType.amount;

		return { ...state, [action.rewardType.currency]: redeemedCurrency };
	},
	purchaseTalisman: (state, action) => {
		const purchasedCurrency = state[action.cost.currency] - action.cost.amount;

		return { ...state, [action.cost.currency]: purchasedCurrency };
	},
	redeemCode: (state, action) => {
		if (action.currency === undefined) {
			return state;
		}

		const redeemedCurrency = state[action.currency.name] + action.currency.amount;

		return { ...state, [action.currency.name]: redeemedCurrency };
	},
});
/* eslint-enable jsdoc/require-jsdoc */
