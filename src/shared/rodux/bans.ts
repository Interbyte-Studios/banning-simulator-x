import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";

export type BansState = number;
export type BansActions = KillNpc;

export const defaultBansState: BansState = 0;

/* eslint-disable jsdoc/require-jsdoc */
export const bansReducer = Rodux.createReducer<BansState, BansActions>(defaultBansState, {
	killNpc: (state, action) => {
		return state + action.bans;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
