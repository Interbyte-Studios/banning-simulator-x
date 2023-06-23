import Net from "@rbxts/net";
import { BoostProduct } from "shared/configs/game";
import { ValidBoostTime } from "shared/rodux/boosts";

export const claimClubRewardDefinition = Net.Definitions.ServerAsyncFunction<
	() =>
		| {
				success: true;
				petId?: number;
				boost?: {
					name: BoostProduct;
					duration: ValidBoostTime;
				};
		  }
		| { success: false }
>();
export type ClaimClubRewardDefinition = typeof claimClubRewardDefinition;
