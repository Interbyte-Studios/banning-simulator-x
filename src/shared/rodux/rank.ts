import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { Currency } from "shared/configs/currencies";

export const ValidRank = t.numberConstrained(1, 20);
export type RankState = t.static<typeof ValidRank>;
export type RankActions = UnlockRank | ResetRank;

export interface UnlockRank extends Rodux.Action<"unlockRank"> {
	currency: Currency;
	cost: number;
	rankNumber: RankState;
}

export interface ResetRank extends Rodux.Action<"resetRank"> {}

/**
 * @param rankNumber The id of the rank the player has unlocked.
 * @param currency The currency type used to unlock the rank.
 * @param cost The amount of currency the rank cost.
 * @returns The Rodux action to dispatch.
 */
export function unlockRank(rankNumber: RankState, currency: Currency, cost: number): UnlockRank & Rodux.AnyAction {
	return {
		type: "unlockRank",
		rankNumber,
		currency,
		cost,
	};
}

/**
 * @returns The Rodux action to dispatch.
 */
export function resetRank(): ResetRank & Rodux.AnyAction {
	return {
		type: "resetRank",
	};
}

// default rank is rank 1
export const defaultRank = 1;

/* eslint-disable jsdoc/require-jsdoc */
export const rankReducer = Rodux.createReducer<RankState, RankActions>(defaultRank, {
	unlockRank: (_, action) => {
		return action.rankNumber;
	},
	resetRank: () => {
		return defaultRank;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
