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
		return {
			...state,
			bans: state.bans + 1,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
