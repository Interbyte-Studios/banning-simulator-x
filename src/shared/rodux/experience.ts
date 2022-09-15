import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";
import { RedeemCode } from "./media";
import { RedeemQuest } from "./quests";

export type ExperienceState = number;

/* eslint-disable jsdoc/require-jsdoc */
export const experienceReducer = Rodux.createReducer<ExperienceState, KillNpc | RedeemQuest | RedeemCode>(0, {
	killNpc: (state, action) => {
		return state + action.experience;
	},
	redeemQuest: (state, action) => {
		return state + action.experience;
	},
	redeemCode: (state, action) => {
		if (action.experience === undefined) {
			return state;
		}

		return state + action.experience;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
