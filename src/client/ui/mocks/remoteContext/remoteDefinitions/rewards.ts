import { ClaimClubRewardDefinition } from "shared/remotes/rewards/clubReward";
import { ClaimGroupRewardDefinition } from "shared/remotes/rewards/groupReward";
import { ClaimVIPRewardDefinition } from "shared/remotes/rewards/vipReward";

import { fakeFunctionCall } from "../fakeFunctionCall";

/**
 *  This is the remote context for the rewards remote functions.
 */
export const rewardsRemoteContext = {
	claimVIPReward: fakeFunctionCall<ClaimVIPRewardDefinition>("claimVipReward", () => {
		return {
			success: false,
		};
	}),
	claimGroupReward: fakeFunctionCall<ClaimGroupRewardDefinition>("claimGroupReward", () => {
		return {
			success: false,
		};
	}),
	claimClubReward: fakeFunctionCall<ClaimClubRewardDefinition>("claimClubReward", () => {
		return {
			success: false,
		};
	}),
};
