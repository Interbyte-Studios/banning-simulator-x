import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { BoostProduct } from "shared/configs/game";

import { RedeemCode } from "./media";
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
	BoostActions | RedeemCode | ClaimGroupReward | ClaimClubReward | ClaimVIPReward
>(defaultBoosts, {
	storeBoost: (state, action) => {
		const newState = { ...state };
		const timeIndex = tostring(action.boostTime) as ValidStoredBoostTime;

		newState.storage = {
			...newState.storage,
			[action.name]: {
				...newState.storage[action.name],
				[action.boostTime]: newState.storage[action.name][timeIndex] + 1,
			},
		};

		return newState;
	},
	claimBoost: (state, action) => {
		const newState = { ...state };
		newState.active = {
			...newState.active,
			[action.name]: newState.active[action.name] + action.boostTime * action.extendedDurationMultiplier,
		};
		newState.uses += 1;

		return newState;
	},
	claimClubReward: (state, action) => {
		const newState = { ...state };

		newState.storage = {
			...newState.storage,
			[action.boostName]: {
				...newState.storage[action.boostName],
				"15": newState.storage[action.boostName]["15"] + 1,
			},
		};

		return newState;
	},
	claimGroupReward: (state, action) => {
		const newState = { ...state };

		newState.storage = {
			...newState.storage,
			[action.boostName]: {
				...newState.storage[action.boostName],
				"15": newState.storage[action.boostName]["15"] + 1,
			},
		};

		return newState;
	},
	claimVIPReward: (state, action) => {
		const newState = { ...state };

		newState.storage = {
			...newState.storage,
			[action.boostName]: {
				...newState.storage[action.boostName],
				"15": newState.storage[action.boostName]["15"] + 1,
			},
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
		const timeIndex = tostring(action.boosts.time) as ValidStoredBoostTime;

		newState.storage = {
			...newState.storage,
			[action.name]: {
				...newState.storage[action.boosts.name],
				[action.boosts.time]: newState.storage[action.boosts.name][timeIndex] + 1,
			},
		};

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
