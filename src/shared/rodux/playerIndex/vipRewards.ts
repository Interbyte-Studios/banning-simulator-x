import Rodux from "@rbxts/rodux";
import { BoostProduct } from "shared/configs/game";

export interface VipRewardsState {
	lastClaimed: DateTime;
	lastPetIdClaimed: number;
}

export type VipRewardsActions = ClaimVIPReward;

export interface ClaimVIPReward extends Rodux.Action<"claimVIPReward"> {
	claimTime: DateTime;
	boostName: BoostProduct;
	petId?: number;
}

/**
 * @param claimTime The time it was claimed.
 * @param boostName The name of the boost that was claimed.
 * @param petId The pet id that was claimed.
 * @returns The Rodux action to dispatch.
 */
export function claimVIPReward(
	claimTime: DateTime,
	boostName: BoostProduct,
	petId?: number,
): ClaimVIPReward & Rodux.AnyAction {
	return {
		type: "claimVIPReward",
		claimTime,
		petId,
		boostName,
	};
}

export const defaultVipRewardsState: VipRewardsState = {
	lastClaimed: DateTime.fromUnixTimestamp(0),
	lastPetIdClaimed: 0,
};
/* eslint-disable jsdoc/require-jsdoc */
export const vipRewardsReducer = Rodux.createReducer<VipRewardsState, VipRewardsActions>(defaultVipRewardsState, {
	claimVIPReward: (state, action) => {
		return {
			...state,
			lastClaimed: action.claimTime,
			lastPetIdClaimed: action.petId !== undefined ? action.petId : state.lastPetIdClaimed,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
