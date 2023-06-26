import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { BoostProduct } from "shared/configs/game";

import { ClaimClubReward, ClaimGroupReward, ClaimVIPReward } from "./playerIndex";

export interface BoostsState {
	storage: {
		[boost in BoostProduct]: {
			[time in ValidStoredBoostTime]: number;
		};
	};
	active: {
		[boost in BoostProduct]: number;
	};
	uses: number;
}
export type BoostActions = StoreBoost | ClaimBoost | UseBoosts;

export const validBoostTime = t.union(t.literal(15), t.literal(30), t.literal(60), t.literal(120));
export type ValidBoostTime = t.static<typeof validBoostTime>;

export const validStoredBoostTime = t.union(t.literal("15"), t.literal("30"), t.literal("60"), t.literal("120"));
export type ValidStoredBoostTime = t.static<typeof validStoredBoostTime>;

export type ValidBoostUseRecord = Array<BoostProduct>;

interface StoreBoost extends Rodux.Action<"storeBoost"> {
	name: BoostProduct;
	boostTime: ValidBoostTime;
}

interface ClaimBoost extends Rodux.Action<"claimBoost"> {
	name: BoostProduct;
	boostTime: ValidBoostTime;
	extendedDurationMultiplier: number;
}

interface UseBoosts extends Rodux.Action<"useBoosts"> {
	boosts: Array<BoostProduct>;
}

/**
 * @param name The name of the boost.
 * @param boostTime The amount of time to dispatch.
 * @returns The Rodux action to dispatch.
 */
export function storeBoost(name: BoostProduct, boostTime: ValidBoostTime): StoreBoost & Rodux.AnyAction {
	return {
		type: "storeBoost",
		name,
		boostTime,
	};
}

/**
 * @param boostName The name of the product that's being claimed.
 * @param boostTime The time that should be added.
 * @param extendedDurationMultiplier The extended duration multiplier provided by mastery.
 * @returns The Rodux action to dispatch.
 */
export function claimBoost(
	boostName: BoostProduct,
	boostTime: ValidBoostTime,
	extendedDurationMultiplier: number,
): ClaimBoost & Rodux.AnyAction {
	return {
		type: "claimBoost",
		name: boostName,
		boostTime,
		extendedDurationMultiplier,
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

export const defaultBoosts: BoostsState = {
	storage: {
		["x2 Currency"]: {
			"15": 0,
			"30": 0,
			"60": 0,
			"120": 0,
		},
		["x2 Rank Experience"]: {
			"15": 0,
			"30": 0,
			"60": 0,
			"120": 0,
		},
		["x2 Pet Experience"]: {
			"15": 0,
			"30": 0,
			"60": 0,
			"120": 0,
		},
		["x2 Hatching Luck"]: {
			"15": 0,
			"30": 0,
			"60": 0,
			"120": 0,
		},
	},
	active: {
		["x2 Currency"]: 0,
		["x2 Rank Experience"]: 0,
		["x2 Pet Experience"]: 0,
		["x2 Hatching Luck"]: 0,
	},
	uses: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const boostsReducer = Rodux.createReducer<
	BoostsState,
	BoostActions | ClaimGroupReward | ClaimClubReward | ClaimVIPReward
>(defaultBoosts, {
	storeBoost: (state, action) => {
		const timeIndex = tostring(action.boostTime) as ValidStoredBoostTime;

		return {
			...state,
			storage: {
				...state.storage,
				[action.name]: {
					...state.storage[action.name],
					[timeIndex]: state.storage[action.name][timeIndex] + 1,
				},
			},
		};
	},
	claimBoost: (state, action) => {
		const timeIndex = tostring(action.boostTime) as ValidStoredBoostTime;
		const storedBoost = state.storage[action.name][timeIndex];
		if (storedBoost === undefined || storedBoost < 1) {
			return state;
		}

		const additionalTime = action.boostTime * 60;

		return {
			...state,
			active: {
				...state.active,
				[action.name]: state.active[action.name] + additionalTime * action.extendedDurationMultiplier,
			},
			storage: {
				...state.storage,
				[action.name]: {
					...state.storage[action.name],
					[timeIndex]: state.storage[action.name][timeIndex] - 1,
				},
			},
			uses: state.uses + 1,
		};
	},
	claimClubReward: (state, action) => {
		return {
			...state,
			storage: {
				...state.storage,
				[action.boostName]: {
					...state.storage[action.boostName],
					"15": state.storage[action.boostName]["15"] + 1,
				},
			},
		};
	},
	claimGroupReward: (state, action) => {
		return {
			...state,
			storage: {
				...state.storage,
				[action.boostName]: {
					...state.storage[action.boostName],
					"15": state.storage[action.boostName]["15"] + 1,
				},
			},
		};
	},
	claimVIPReward: (state, action) => {
		return {
			...state,
			storage: {
				...state.storage,
				[action.boostName]: {
					...state.storage[action.boostName],
					"15": state.storage[action.boostName]["15"] + 1,
				},
			},
		};
	},
	useBoosts: (state, action) => {
		return {
			...state,
			active: {
				...state.active,
				"x2 Currency": action.boosts.includes("x2 Currency")
					? state.active["x2 Currency"] - 1
					: state.active["x2 Currency"],
				"x2 Rank Experience": action.boosts.includes("x2 Rank Experience")
					? state.active["x2 Rank Experience"] - 1
					: state.active["x2 Rank Experience"],
				"x2 Pet Experience": action.boosts.includes("x2 Pet Experience")
					? state.active["x2 Pet Experience"] - 1
					: state.active["x2 Pet Experience"],
				"x2 Hatching Luck": action.boosts.includes("x2 Hatching Luck")
					? state.active["x2 Hatching Luck"] - 1
					: state.active["x2 Hatching Luck"],
			},
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
