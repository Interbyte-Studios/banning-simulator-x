import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";
import { RedeemCode } from "./media";
import { RedeemQuest } from "./quests";
import { UnlockRank } from "./rank";

export type ExperienceState = number;
export const defaultExperienceState = 0;

/* eslint-disable jsdoc/require-jsdoc */
export const experienceReducer = Rodux.createReducer<ExperienceState, KillNpc | RedeemQuest | RedeemCode | UnlockRank>(
	defaultExperienceState,
	{
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
		unlockRank: () => {
			return 0;
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
