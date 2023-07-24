import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";

export type BansState = number;
export type BansActions = KillNpc | AddBans;

interface AddBans extends Rodux.Action<"addBans"> {
	amount: number;
}

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

export const defaultBansState: BansState = 0;

/* eslint-disable jsdoc/require-jsdoc */
export const bansReducer = Rodux.createReducer<BansState, BansActions>(defaultBansState, {
	killNpc: (state, action) => {
		return state + action.bans;
	},
	addBans: (state, action) => {
		return state + action.amount;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
