import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";
import { RedeemCode } from "./media";
import { RedeemQuest } from "./quests";
import { UnlockRank } from "./rank";

export type ExperienceState = number;

/* eslint-disable jsdoc/require-jsdoc */
export const experienceReducer = Rodux.createReducer<ExperienceState, KillNpc | RedeemQuest | RedeemCode | UnlockRank>(
	0,
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
