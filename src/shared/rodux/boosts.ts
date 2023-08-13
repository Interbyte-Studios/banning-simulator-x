import Object from "@rbxts/object-utils";
import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { BoostProduct } from "shared/configs/game";
import { Modify } from "shared/util/modify";

import { ClaimClubReward } from "./playerIndex/clubRewards";
import { ClaimGroupReward } from "./playerIndex/groupRewards";
import { ClaimVIPReward } from "./playerIndex/vipRewards";

export interface BoostsState {
	storage: {
		[boost in BoostProduct]: {
			[time in ValidBoostTime]: number;
		};
	};
	active: {
		[boost in BoostProduct]: number;
	};
	uses: number;
}
export type BoostActions = StoreBoost | ClaimBoost | UseBoosts;

export type SerializedBoostsState = Modify<
	BoostsState,
	{
		storage: Modify<
			BoostsState["storage"],
			{
				[boost in BoostProduct]: {
					[time in `${ValidBoostTime}`]: number;
				};
			}
		>;
	}
>;

export const validBoostTime = t.union(t.literal(15), t.literal(30), t.literal(60), t.literal(120));
export type ValidBoostTime = t.static<typeof validBoostTime>;

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
		return {
			...state,
			storage: {
				...state.storage,
				[action.name]: {
					...state.storage[action.name],
					[action.boostTime]: state.storage[action.name][action.boostTime] + 1,
				},
			},
		};
	},
	claimBoost: (state, action) => {
		const storedBoost = state.storage[action.name][action.boostTime];
		if (storedBoost === undefined || storedBoost < 1) {
			return state;
		}

		const additionalTime = action.boostTime * 60;

		return {
			active: {
				...state.active,
				[action.name]: state.active[action.name] + additionalTime * action.extendedDurationMultiplier,
			},
			storage: {
				...state.storage,
				[action.name]: {
					...state.storage[action.name],
					[action.boostTime]: state.storage[action.name][action.boostTime] - 1,
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
					15: state.storage[action.boostName][15] + 1,
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
					15: state.storage[action.boostName][15] + 1,
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
					15: state.storage[action.boostName][15] + 1,
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

/**
 * Serializes the boosts Rodux state to a savable format.
 *
 * @param store The Rodux state to serialize.
 * @returns The serialized format.
 */
export function serializeBoosts(store: BoostsState): SerializedBoostsState {
	return {
		...store,
		storage: Object.fromEntries(
			Object.entries(store.storage).map(([boost, lengths]) => {
				// we need to make the lengths string keys
				return [
					boost,
					Object.fromEntries(
						Object.entries(lengths).map(([length, amount]) => [tostring(length) as `${typeof length}`, amount]),
					),
				];
			}),
		),
	};
}

/**
 * Deserializes the boosts DataStore state to the Rodux state.
 *
 * @param state The DataStore state to deserialize.
 * @returns The deserialized format of boosts.
 */
export function deserializeBoosts(state: SerializedBoostsState): BoostsState {
	return {
		...state,
		storage: Object.fromEntries(
			Object.entries(state.storage).map(([boost, lengths]) => {
				return [
					boost,
					Object.fromEntries(
						Object.entries(lengths).map(([length, amount]) => [tonumber(length) as ValidBoostTime, amount]),
					),
				];
			}),
		),
	};
}
