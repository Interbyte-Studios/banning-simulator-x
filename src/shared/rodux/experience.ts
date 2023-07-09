import Rodux from "@rbxts/rodux";

import { KillNpc } from "./currencies";
import { RedeemQuest } from "./quests";
import { UnlockRank } from "./rank";

export type ExperienceState = number;
export type ExperienceActions = ResetExperience;
export const defaultExperienceState = 0;

interface ResetExperience extends Rodux.Action<"resetExperience"> {}

/**
 * @returns The Rodux action to dispatch.
 */
export function resetExperience(): ResetExperience & Rodux.AnyAction {
	return {
		type: "resetExperience",
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const experienceReducer = Rodux.createReducer<
	ExperienceState,
	ExperienceActions | KillNpc | RedeemQuest | UnlockRank
>(defaultExperienceState, {
	killNpc: (state, action) => {
		return state + action.experience;
	},
	redeemQuest: (state, action) => {
		return state + action.experience;
	},
	unlockRank: () => {
		return 0;
	},
	resetExperience: () => {
		return 0;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
