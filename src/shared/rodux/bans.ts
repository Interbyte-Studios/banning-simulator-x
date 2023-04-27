import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";

export interface BansState {
	bans: number;
}

export const defaultBansState: BansState = {
	bans: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const bansReducer = Rodux.createReducer<BansState, KillNpc>(defaultBansState, {
	killNpc: (state) => {
		const newState = { ...state };
		newState.bans += 1;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
