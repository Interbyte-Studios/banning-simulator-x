import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";
import { RedeemQuest } from "./quests";

export type ExperienceState = number;

/* eslint-disable jsdoc/require-jsdoc */
export const experienceReducer = Rodux.createReducer<ExperienceState, KillNpc | RedeemQuest>(0, {
	killNpc: (state, action) => {
		return state + action.experience;
	},
	redeemQuest: (state, action) => {
		return state + action.experience;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
