import Rodux from "@rbxts/rodux";

export interface SpinWheelState {
	totalSpins: number;
	spinsAvailable: number;
	lastSpinTime: number;
}

export type SpinWheelActions = SpinTheWheel | AddAvailableSpins;

interface SpinTheWheel extends Rodux.Action<"spinTheWheel"> {
	timeSpun: number;
}

interface AddAvailableSpins extends Rodux.Action<"addAvailableSpins"> {
	amount: number;
}

/**
 * @param timeSpun The time the wheel was spun.
 * @returns The Rodux action to dispatch.
 */
export function spinTheWheel(timeSpun: number): SpinTheWheel & Rodux.AnyAction {
	return {
		type: "spinTheWheel",
		timeSpun: timeSpun,
	};
}

/**
 * @param amount The amount of spins to add.
 * @returns The Rodux action to dispatch.
 */
export function addAvailableSpins(amount: number): AddAvailableSpins & Rodux.AnyAction {
	return {
		type: "addAvailableSpins",
		amount,
	};
}

export const defaultSpinWheel: SpinWheelState = {
	totalSpins: 0,
	spinsAvailable: 0,
	lastSpinTime: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const spinWheelReducer = Rodux.createReducer<SpinWheelState, SpinWheelActions>(defaultSpinWheel, {
	spinTheWheel: (state, action) => {
		return {
			...state,
			totalSpins: state.totalSpins + 1,
			spinsAvailable: state.spinsAvailable - 1,
			lastSpinTime: action.timeSpun,
		};
	},
	addAvailableSpins: (state, action) => {
		return {
			...state,
			spinsAvailable: state.spinsAvailable + action.amount,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
