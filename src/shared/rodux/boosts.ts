import Rodux from "@rbxts/rodux";
import { BoostProduct } from "shared/configs/game";

export type BoostsState = { [P in BoostProduct]: number };
export type BoostActions = ClaimBoost | UseBoosts;

interface ClaimBoost extends Rodux.Action<"claimBoost"> {
	name: BoostProduct;
	boostTime: number;
}

export type ValidBoostUseRecord = Array<BoostProduct>;

interface UseBoosts extends Rodux.Action<"useBoosts"> {
	boosts: Array<BoostProduct>;
}

/**
 * @param boostName The name of the product that's being claimed.
 * @param boostTime The time that should be added.
 * @returns The Rodux action to dispatch.
 */
export function claimBoost(boostName: BoostProduct, boostTime: number): ClaimBoost & Rodux.AnyAction {
	return {
		type: "claimBoost",
		name: boostName,
		boostTime,
	};
}

/**
 * @param boosts Array of boosts that should be used.
 * @returns The Rodux action to dispatch.
 */
export function useBoosts(boosts: ValidBoostUseRecord): UseBoosts & Rodux.AnyAction {
	return {
		type: "useBoosts",
		boosts,
	};
}

const defaultBoosts: BoostsState = {
	["x2 Boss Drop Luck"]: 0,
	["x2 Currency"]: 0,
	["x2 Experience"]: 0,
	["x2 Pet Experience"]: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const boostsReducer = Rodux.createReducer<BoostsState, BoostActions>(defaultBoosts, {
	claimBoost: (state, action) => {
		const newState = { ...state };
		newState[action.name] += action.boostTime;

		return newState;
	},
	useBoosts: (state, action) => {
		const newState = { ...state };
		for (const boost of action.boosts) {
			newState[boost] -= 1;
		}

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
