import { remotes } from "shared/remotes";

/**
 * Remotes for daily rewards.
 */
export const dailyRewardsRemotes = {
	claimDailyRewards: remotes.Client.Get("claimDailyRewards"),
};
