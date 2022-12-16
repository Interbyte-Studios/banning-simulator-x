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

const defaultSpinWheel: SpinWheelState = {
	startTime: 0,
	endTime: 0,
	spinsDone: 0,
	dayEndTime: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const spinWheelReducer = Rodux.createReducer<SpinWheelState, SpinWheelActions>(defaultSpinWheel, {
	updateWheelTime: (state, action) => {
		const newState: SpinWheelState = { ...state };
		newState.startTime = action.startTime;
		newState.endTime = action.endTime;
		newState.dayEndTime = action.dayEndTime;

		return newState;
	},
	updateWheelUses: (state, action) => {
		const newState: SpinWheelState = { ...state };
		newState.spinsDone = action.timesSpinned;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
