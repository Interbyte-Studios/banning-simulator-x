import { t } from "@rbxts/t";
import { ValidBoostTime } from "shared/rodux/boosts";

import { Currency } from "./currencies";
import { BoostProduct } from "./game";

export const rewardTypes = ["currency", "boosts", "pet"] as const;
export const isRewardType = t.literal(...rewardTypes);
export type rewardType = t.static<typeof isRewardType>;

export const spinRewards: Record<
	number,
	{
		rewardType: rewardType;
		rewardData: {
			name?: Currency;
			boostName?: BoostProduct;
			boostAmount?: ValidBoostTime;
			petId?: number;
			amount?: number;
		};
	}
> = {
	1: { rewardType: "currency", rewardData: { name: "coins", amount: 100 } },
	2: { rewardType: "currency", rewardData: { name: "gems", amount: 20 } },
	3: { rewardType: "currency", rewardData: { name: "coins", amount: 600 } },
	4: { rewardType: "boosts", rewardData: { boostName: "x2 Currency", boostAmount: 15 } },
	5: { rewardType: "pet", rewardData: { petId: 1, amount: 1 } },
	6: { rewardType: "pet", rewardData: { petId: 12, amount: 1 } },
	7: { rewardType: "pet", rewardData: { petId: 5, amount: 1 } },
	8: { rewardType: "pet", rewardData: { petId: 2, amount: 1 } },
};
