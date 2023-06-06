import Rodux from "@rbxts/rodux";

export interface SpinWheelState {
	startTime: number;
	endTime: number;
	dayEndTime: number;
	spinsDone: number;
}

export type SpinWheelActions = UpdateWheelTime | UpdateWheelUses;

interface UpdateWheelTime extends Rodux.Action<"updateWheelTime"> {
	startTime: number;
	endTime: number;
	dayEndTime: number;
}

interface UpdateWheelUses extends Rodux.Action<"updateWheelUses"> {
	timesSpinned: number;
}

/**
 *
 * @param startTime The time when player first spun the wheel.
 * @param endTime The time when player reaches max spins for a day.
 * @param dayEndTime The time when the spins get reset.
 * @returns The Rodux action to dispatch.
 */
export function updateWheelTime(
	startTime: number,
	endTime: number,
	dayEndTime: number,
): UpdateWheelTime & Rodux.AnyAction {
	return {
		type: "updateWheelTime",
		startTime: startTime,
		endTime: endTime,
		dayEndTime: dayEndTime,
	};
}

/**
 *
 * @param timesSpinned Amount of uses added.
 * @returns The Rodux action to dispatch.
 */
export function updateWheelUses(timesSpinned: number): UpdateWheelUses & Rodux.AnyAction {
	return {
		type: "updateWheelUses",
		timesSpinned: timesSpinned,
	};
}

export const defaultSpinWheel: SpinWheelState = {
	startTime: 0,
	endTime: 0,
	spinsDone: 0,
	dayEndTime: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const spinWheelReducer = Rodux.createReducer<SpinWheelState, SpinWheelActions>(defaultSpinWheel, {
	updateWheelTime: (state, action) => {
		return {
			...state,
			startTime: action.startTime,
			endTime: action.endTime,
			dayEndTime: action.dayEndTime,
		};
	},
	updateWheelUses: (state, action) => {
		return {
			...state,
			spinsDone: action.timesSpinned,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
