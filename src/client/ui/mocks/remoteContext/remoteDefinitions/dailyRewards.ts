import { ClaimDailyRewardsDefinition } from "shared/remotes/dailyRewards";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the daily rewards remote functions.
 */
export const dailyRewardsRemoteContext = {
	claimDailyRewards: fakeRemoteCall<ClaimDailyRewardsDefinition>("claimDailyRewardsDefinition"),
};
