import Net from "@rbxts/net";

import { claimClubRewardDefinition } from "./clubReward";
import { claimGroupRewardDefinition } from "./groupReward";
import { claimVIPRewardDefinition } from "./vipReward";

export const rewardsDefinition = Net.Definitions.Namespace({
	claimClubReward: claimClubRewardDefinition,
	claimGroupReward: claimGroupRewardDefinition,
	claimVIPReward: claimVIPRewardDefinition,
});
