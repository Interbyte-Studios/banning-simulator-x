import Object from "@rbxts/object-utils";
import Rodux from "@rbxts/rodux";
import { currencies, Currency } from "shared/configs/currencies";

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
	| EnhancePet
	| UnlockRank
>(defaultCurrencies, {
	purchaseWeapon: (state, action) => {
		return {
			...state,
			[action.cost.currency]: state[action.cost.currency] - action.cost.amount,
		};
	},
	killNpc: (state, action) => {
		return {
			...state,
			[action.currencyType]: state[action.currencyType] + action.currency,
		};
	},
	unlockWorld: (state, action) => {
		return {
			...state,
			[action.currency.type]: state[action.currency.type] - action.currency.amount,
		};
	},
	unlockZone: (state, action) => {
		return {
			...state,
			[action.currency.type]: state[action.currency.type] - action.currency.amount,
		};
	},
	addPet: (state, action) => {
		return {
			...state,
			[action.currencyType]: state[action.currencyType] - action.cost,
		};
	},
	redeemQuest: (state, action) => {
		if (action.rewardType.kind !== "currency") {
			return state;
		}

		return {
			...state,
			[action.rewardType.currency]: state[action.rewardType.currency] + action.rewardType.amount,
		};
	},
	purchaseTalisman: (state, action) => {
		return {
			...state,
			[action.cost.currency]: state[action.cost.currency] - action.cost.amount,
		};
	},
	enhancePet: (state, action) => {
		return {
			...state,
			gems: state.gems - action.cost,
		};
	},
	unlockRank: (state, action) => {
		return {
			...state,
			[action.currency]: state[action.currency] - action.cost,
		};
	},
	awardCurrency: (state, action) => {
		return {
			...state,
			[action.currency]: state[action.currency] + action.amount,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
