import { t } from "@rbxts/t";

import { Currency } from "./currencies";

export const rewardTypes = ["currency", "boosts", "pet"] as const;
export const isRewardType = t.literal(...rewardTypes);
export type rewardType = t.static<typeof isRewardType>;

export const spinRewards: Record<
	number,
	{ rewardType: rewardType; rewardData: { name?: Currency; petId?: number; amount: number } }
> = {
	1: { rewardType: "currency", rewardData: { name: "coins", amount: 100 } },
	2: { rewardType: "currency", rewardData: { name: "gems", amount: 20 } },
	3: { rewardType: "currency", rewardData: { name: "coins", amount: 600 } },
	4: { rewardType: "boosts", rewardData: { name: "coins", amount: 1 } },
	5: { rewardType: "boosts", rewardData: { name: "gems", amount: 1 } },
	6: { rewardType: "boosts", rewardData: { name: "coins", amount: 1 } },
	7: { rewardType: "pet", rewardData: { petId: 5, amount: 1 } },
	8: { rewardType: "pet", rewardData: { petId: 2, amount: 2 } },
};
