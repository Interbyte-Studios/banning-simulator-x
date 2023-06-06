import { remotes } from "shared/remotes";

const namespace = remotes.Client.GetNamespace("rewards");

/**
 * Remotes for rewards.
 */
export const rewardRemotes = {
	claimVIPReward: namespace.Get("claimVIPReward"),
	claimGroupReward: namespace.Get("claimGroupReward"),
	claimClubReward: namespace.Get("claimClubReward"),
};
