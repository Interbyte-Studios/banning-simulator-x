import Rodux from "@rbxts/rodux";
import { BoostProduct } from "shared/configs/game";

export interface GroupRewardsState {
	lastClaimed: DateTime;
	lastPetIdClaimed: number;
}

export type GroupRewardsActions = ClaimGroupReward;

export interface ClaimGroupReward extends Rodux.Action<"claimGroupReward"> {
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
export function claimGroupReward(
	claimTime: DateTime,
	boostName: BoostProduct,
	petId?: number,
): ClaimGroupReward & Rodux.AnyAction {
	return {
		type: "claimGroupReward",
		claimTime,
		petId,
		boostName,
	};
}

export const defaultGroupRewardsState: GroupRewardsState = {
	lastClaimed: DateTime.fromUnixTimestamp(0),
	lastPetIdClaimed: 0,
};
/* eslint-disable jsdoc/require-jsdoc */
export const groupRewardsReducer = Rodux.createReducer<GroupRewardsState, GroupRewardsActions>(
	defaultGroupRewardsState,
	{
		claimGroupReward: (state, action) => {
			return {
				...state,
				lastClaimed: action.claimTime,
				lastPetIdClaimed: action.petId !== undefined ? action.petId : state.lastPetIdClaimed,
			};
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
