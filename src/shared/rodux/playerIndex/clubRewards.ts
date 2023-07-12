import Rodux from "@rbxts/rodux";
import { BoostProduct } from "shared/configs/game";

export interface ClubRewardsState {
	lastClaimed: DateTime;
	lastPetIdClaimed: number;
}

export type ClubRewardsActions = ClaimClubReward;

export interface ClaimClubReward extends Rodux.Action<"claimClubReward"> {
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
export function claimClubReward(
	claimTime: DateTime,
	boostName: BoostProduct,
	petId?: number,
): ClaimClubReward & Rodux.AnyAction {
	return {
		type: "claimClubReward",
		claimTime,
		petId,
		boostName,
	};
}

export const defaultClubRewardsState: ClubRewardsState = {
	lastClaimed: DateTime.fromUnixTimestamp(0),
	lastPetIdClaimed: 0,
};
/* eslint-disable jsdoc/require-jsdoc */
export const clubRewardsReducer = Rodux.createReducer<ClubRewardsState, ClubRewardsActions>(defaultClubRewardsState, {
	claimClubReward: (state, action) => {
		return {
			...state,
			lastClaimed: action.claimTime,
			lastPetIdClaimed: action.petId !== undefined ? action.petId : state.lastPetIdClaimed,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
