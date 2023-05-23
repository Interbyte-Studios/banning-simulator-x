import Object from "@rbxts/object-utils";
import Rodux from "@rbxts/rodux";
import { currencies, Currency } from "shared/configs/currencies";

import { RedeemCode } from "./media";
import { AddPet, EnhancePet, Pet } from "./pets";
import { RedeemQuest } from "./quests";
import { UnlockRank } from "./rank";
import { PurchaseTalisman } from "./talismans";
import { PurchaseWeapon } from "./weapons";
import { UnlockWorld, UnlockZone } from "./worlds";

export type CurrenciesState = { [P in Currency]: number };
export type CurrenciesActions = KillNpc | AwardCurrency;

export interface KillNpc extends Rodux.Action<"killNpc"> {
	currency: number;
	currencyType: Currency;
	experience: number;
	weaponId: number;
	talismanId: number | undefined;
	petExperienceMultiplier: number;
	equippedPets: Array<Pet>;
}

export interface AwardCurrency extends Rodux.Action<"awardCurrency"> {
	currency: Currency;
	amount: number;
}

/**
 * @param currencyAmount The amount of currency to reward the player with.
 * @param currencyType The type of currency to reward the player with.
 * @param experience The amount of experience to give them.
 * @param weaponId The id of the weapon the player has equipped.
 * @param talismanId The id of the talisman the player has equipped.
 * @param petExperienceMultiplier Additional experience granted to pets.
 * @param equippedPets The pets the player has equipped.
 * @returns The Rodux action to dispatch.
 */
export function killNpc(
	currencyAmount: number,
	currencyType: Currency,
	experience: number,
	weaponId: number,
	talismanId: number | undefined,
	petExperienceMultiplier: number,
	equippedPets: Array<Pet>,
): KillNpc & Rodux.AnyAction {
	return {
		type: "killNpc",
		currency: currencyAmount,
		currencyType,
		experience,
		weaponId,
		talismanId,
		petExperienceMultiplier,
		equippedPets,
	};
}

/**
 * @param currency The type of currency to reward the player with.
 * @param amount The amount of currency to reward the player with.
 * @returns The Rodux action to dispatch.
 */
export function awardCurrency(currency: Currency, amount: number): AwardCurrency & Rodux.AnyAction {
	return {
		type: "awardCurrency",
		currency,
		amount,
	};
}

// start with 0 currency
const defaultCurrencyAmount = 0;
export const defaultCurrencies = Object.fromEntries(
	Object.values(currencies).map((currency) => [currency, defaultCurrencyAmount] as const),
);

/* eslint-disable jsdoc/require-jsdoc */
export const currenciesReducer = Rodux.createReducer<
	CurrenciesState,
	| CurrenciesActions
	| PurchaseWeapon
	| UnlockWorld
	| UnlockZone
	| AddPet
	| RedeemQuest
	| PurchaseTalisman
	| RedeemCode
	| EnhancePet
	| UnlockRank
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
		const purchasedCurrency = state[action.currencyType] - action.cost;

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
	enhancePet: (state, action) => {
		const purchasedCurrency = state.gems - action.cost;
		return { ...state, gems: purchasedCurrency };
	},
	unlockRank: (state, action) => {
		const purchasedCurency = state[action.currency] - action.cost;
		return { ...state, [action.currency]: purchasedCurency };
	},
	awardCurrency: (state, action) => {
		const newState = { ...state };
		newState[action.currency] += action.amount;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
