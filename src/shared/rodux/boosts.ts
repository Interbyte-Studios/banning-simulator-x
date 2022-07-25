import Rodux from "@rbxts/rodux";
import { BoostProducts } from "shared/configs/game";

export type BoostsState = { [P in BoostProducts]: number };
export type BoostActions = ClaimBoost;

interface ClaimBoost extends Rodux.Action<"claimBoost"> {
	name: BoostProducts;
	boostTime: number;
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

const defaultBoosts: BoostsState = {
	["x2 Boss Drop Luck"]: 1,
	["x2 Currency"]: 1,
	["x2 Experience"]: 1,
	["x2 Pet Experience"]: 1,
};

/* eslint-disable jsdoc/require-jsdoc */
export const boostsReducer = Rodux.createReducer<BoostsState, BoostActions>(defaultBoosts, {
	claimBoost: (state, action) => {
		const newState = { ...state };
		newState[action.name] += action.boostTime;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
