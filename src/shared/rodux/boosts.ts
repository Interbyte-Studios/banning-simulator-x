import Rodux from "@rbxts/rodux";
import { BoostProducts } from "shared/configs/game";

export type BoostsState = { [P in BoostProducts]: number };
export type BoostActions = ClaimBoost | UseBoost;

interface ClaimBoost extends Rodux.Action<"claimBoost"> {
	name: BoostProducts;
	boostTime: number;
}

interface UseBoost extends Rodux.Action<"useBoost"> {
	name: BoostProducts;
}

/**
 * @param boostName The name of the product that's being claimed.
 * @param boostTime The time that should be added.
 * @returns The Rodux action to dispatch.
 */
export function claimBoost(boostName: BoostProducts, boostTime: number): ClaimBoost & Rodux.AnyAction {
	return {
		type: "claimBoost",
		name: boostName,
		boostTime,
	};
}

/**
 * @param boostName The name of the product that's being used.
 * @returns The Rodux action to dispatch.
 */
export function useBoost(boostName: BoostProducts): UseBoost & Rodux.AnyAction {
	return {
		type: "useBoost",
		name: boostName,
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
	useBoost: (state, action) => {
		const newState = { ...state };
		newState[action.name] -= 1;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
