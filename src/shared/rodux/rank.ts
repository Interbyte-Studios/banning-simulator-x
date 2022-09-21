import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";

export const ValidRank = t.numberConstrained(1, 20);
export type RankState = t.static<typeof ValidRank>;
export type RankActions = UnlockRank;

export interface UnlockRank extends Rodux.Action<"unlockRank"> {
	rankNumber: RankState;
}

/**
 * @param rankNumber The id of the rank the player has unlocked.
 * @returns The Rodux action to dispatch.
 */
export function unlockRank(rankNumber: RankState): UnlockRank & Rodux.AnyAction {
	return {
		type: "unlockRank",
		rankNumber,
	};
}

// default rank is rank 1
const defaultRank = 16;

/* eslint-disable jsdoc/require-jsdoc */
export const rankReducer = Rodux.createReducer<RankState, UnlockRank>(defaultRank, {
	unlockRank: (_, action) => {
		return action.rankNumber;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
