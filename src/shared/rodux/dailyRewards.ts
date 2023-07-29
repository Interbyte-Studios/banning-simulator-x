import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";

export const isDailyRewardCacheType = t.literal(1, 2, 3, 4, 5, 6);
export type DailyRewardCacheType = t.static<typeof isDailyRewardCacheType>;

export type DailyRewardsState = {
	lastClaimed: number;
	daysClaimed: Array<DailyRewardCacheType>;
};
export type DailyRewardsActions = ClaimDailyReward;

interface ClaimDailyReward extends Rodux.Action<"claimDailyReward"> {
	now: number;
}

/**
 * @param now The time to claim the daily reward.
 * @returns The Rodux action to dispatch.
 */
export function claimDailyRewards(now: number): ClaimDailyReward & Rodux.AnyAction {
	return {
		type: "claimDailyReward",
		now,
	};
}

export const defaultDailyRewards = {
	lastClaimed: 0,
	daysClaimed: [],
};

/* eslint-disable jsdoc/require-jsdoc */
export const dailyRewardsReducer = Rodux.createReducer<DailyRewardsState, DailyRewardsActions>(defaultDailyRewards, {
	claimDailyReward: (state, action) => {
		const daysClaimed = state.daysClaimed.size();
		let newDay = daysClaimed + 1;
		if (newDay >= 7) {
			newDay = 0;
		}

		return {
			lastClaimed: action.now,
			daysClaimed: newDay <= 0 ? [] : [...state.daysClaimed, newDay as DailyRewardCacheType],
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
