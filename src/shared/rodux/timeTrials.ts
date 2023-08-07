import Rodux from "@rbxts/rodux";
import { TimeTrialUpgradeType } from "shared/configs/timeTrials";
import { WorldName } from "shared/configs/worlds";

type WorldData = { [UpgradeType in TimeTrialUpgradeType]: number };

export type TimeTrialsState = {
	[World in WorldName]: WorldData & { highestHardWave: number };
};
export type TimeTrialsActions = ClaimTimeTrialUpgrade | SetHighestHardWave;

interface ClaimTimeTrialUpgrade extends Rodux.Action<"claimTimeTrialUpgrade"> {
	worldName: WorldName;
	upgradeName: TimeTrialUpgradeType;
}

interface SetHighestHardWave extends Rodux.Action<"setHighestHardWave"> {
	worldName: WorldName;
	wave: number;
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

/**
 * @param worldName The name of the world that the highest wave is being set for.
 * @param wave The highest wave that the player has reached in hard mode.
 * @returns The Rodux action to dispatch.
 */
export function setHighestHardWave(worldName: WorldName, wave: number): SetHighestHardWave & Rodux.AnyAction {
	return {
		type: "setHighestHardWave",
		worldName,
		wave,
	};
}

export const defaultTimeTrialsState: TimeTrialsState = {
	"Ban Land": {
		health: 0,
		damage: 0,
		damageReduction: 0,
		criticalChance: 0,
		highestHardWave: 0,
	},
	"Cyber Cities": {
		health: 0,
		damage: 0,
		damageReduction: 0,
		criticalChance: 0,
		highestHardWave: 0,
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
	setHighestHardWave: (state, action) => {
		return {
			...state,
			[action.worldName]: {
				...state[action.worldName],
				highestHardWave: action.wave,
			},
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
