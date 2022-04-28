import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";

export type ExperienceState = number;

/* eslint-disable jsdoc/require-jsdoc */
export const experienceReducer = Rodux.createReducer<ExperienceState, KillNpc>(0, {
	killNpc: (state, action) => {
		return state + action.experience;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
