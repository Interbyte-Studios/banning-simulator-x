import Rodux from "@rbxts/rodux";
import { TimeTrialUpgradeType } from "shared/configs/timeTrials";
import { WorldName } from "shared/configs/worlds";

export type TimeTrialsState = { [World in WorldName]: { [UpgradeType in TimeTrialUpgradeType]: number } };
export type TimeTrialsActions = ClaimTimeTrialUpgrade;

interface ClaimTimeTrialUpgrade extends Rodux.Action<"claimTimeTrialUpgrade"> {
	worldName: WorldName;
	upgradeName: TimeTrialUpgradeType;
}

/**
 * @param worldName The name of the world that the upgrade is being claimed in.
 * @param upgradeName The name of the upgrade that's being claimed.
 * @returns The Rodux action to dispatch.
 */
export function claimTimeTrialUpgrade(
	worldName: WorldName,
	upgradeName: TimeTrialUpgradeType,
): ClaimTimeTrialUpgrade & Rodux.AnyAction {
	return {
		type: "claimTimeTrialUpgrade",
		worldName,
		upgradeName,
	};
}

export const defaultTimeTrialsState: TimeTrialsState = {
	"Ban Land": {
		health: 0,
		damage: 0,
		damageReduction: 0,
		criticalChance: 0,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const timeTrialsReducer = Rodux.createReducer<TimeTrialsState, TimeTrialsActions>(defaultTimeTrialsState, {
	claimTimeTrialUpgrade: (state, action) => {
		return {
			...state,
			[action.worldName]: {
				...state[action.worldName],
				[action.upgradeName]: state[action.worldName][action.upgradeName] + 1,
			},
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
