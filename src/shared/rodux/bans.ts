import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";

export interface BansState {
	bans: number;
}
export type BansActions = KillNpc | ResetBans;

export const defaultBansState: BansState = {
	bans: 0,
};

interface ResetBans extends Rodux.Action<"resetBans"> {}

/**
 * @returns The Rodux action to dispatch.
 */
export function resetBans(): ResetBans & Rodux.AnyAction {
	return {
		type: "resetBans",
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const bansReducer = Rodux.createReducer<BansState, BansActions>(defaultBansState, {
	killNpc: (state, action) => {
		return {
			...state,
			bans: state.bans + action.bans,
		};
	},
	resetBans: () => {
		return {
			bans: 0,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
