import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { BoostProduct } from "shared/configs/game";

import { RedeemCode } from "./media";

export interface BoostsState {
	storage: {
		[boost in BoostProduct]: {
			[time in ValidBoostTime]: number;
		};
	};
	active: {
		[boost in BoostProduct]: number;
	};
}
export type BoostActions = ClaimBoost | UseBoosts;

export const validBoostTime = t.union(t.literal(15), t.literal(30), t.literal(60), t.literal(120));
export type ValidBoostTime = t.static<typeof validBoostTime>;

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
	storage: {
		["x2 Currency"]: {
			15: 0,
			30: 0,
			60: 0,
			120: 0,
		},
		["x2 Rank Experience"]: {
			15: 0,
			30: 0,
			60: 0,
			120: 0,
		},
		["x2 Pet Experience"]: {
			15: 0,
			30: 0,
			60: 0,
			120: 0,
		},
		["x2 Hatching Luck"]: {
			15: 0,
			30: 0,
			60: 0,
			120: 0,
		},
	},
	active: {
		["x2 Currency"]: 0,
		["x2 Rank Experience"]: 0,
		["x2 Pet Experience"]: 0,
		["x2 Hatching Luck"]: 500000000,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const boostsReducer = Rodux.createReducer<BoostsState, BoostActions | RedeemCode>(defaultBoosts, {
	claimBoost: (state, action) => {
		const newState = { ...state };
		newState.active = {
			...newState.active,
			[action.name]: newState.active[action.name] + action.boostTime,
		};

		return newState;
	},
	useBoosts: (state, action) => {
		const newState = { ...state };

		for (const boost of action.boosts) {
			newState.active = {
				...newState.active,
				[boost]: newState.active[boost] - 1,
			};
		}

		return newState;
	},
	redeemCode: (state, action) => {
		if (action.boosts === undefined) {
			return state;
		}

		const newState = { ...state };
		newState.storage = {
			...newState.storage,
			[action.boosts.name]: {
				...newState.storage[action.boosts.name],
				[action.boosts.time]: newState.storage[action.boosts.name][action.boosts.time] + 1,
			},
		};

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
