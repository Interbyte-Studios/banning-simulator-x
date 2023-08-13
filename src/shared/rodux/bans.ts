import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";

export type BansState = {
	bans: number;
	allTimeBans: number;
};
export type BansActions = KillNpc | AddBans | ResetBans;

interface AddBans extends Rodux.Action<"addBans"> {
	amount: number;
}

interface ResetBans extends Rodux.Action<"resetBans"> {}

/**
 * @param amount The amount of bans to add.
 * @returns The Rodux action to dispatch.
 */
export function addBans(amount: number): AddBans & Rodux.AnyAction {
	return {
		type: "addBans",
		amount,
	};
}

/**
 * @returns The Rodux action.
 */
export function resetBans(): ResetBans & Rodux.AnyAction {
	return {
		type: "resetBans",
	};
}

export const defaultBansState: BansState = {
	bans: 0,
	allTimeBans: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const bansReducer = Rodux.createReducer<BansState, BansActions>(defaultBansState, {
	killNpc: (state, action) => {
		return {
			...state,
			bans: state.bans + action.bans,
			allTimeBans: state.allTimeBans + action.bans,
		};
	},
	addBans: (state, action) => {
		return {
			...state,
			bans: state.bans + action.amount,
			allTimeBans: state.allTimeBans + action.amount,
		};
	},
	resetBans: (state) => {
		return {
			...state,
			bans: 0,
			allTimeBans: state.allTimeBans,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
