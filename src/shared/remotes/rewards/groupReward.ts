import Net from "@rbxts/net";
import { BoostProduct } from "shared/configs/game";
import { ValidBoostTime } from "shared/rodux/boosts";

export const claimGroupRewardDefinition = Net.Definitions.ServerAsyncFunction<
	() =>
		| {
				success: true;
				boost: {
					name: BoostProduct;
					duration: ValidBoostTime;
				};
				petId?: number;
		  }
		| { success: false }
>();
export type ClaimGroupRewardDefinition = typeof claimGroupRewardDefinition;
