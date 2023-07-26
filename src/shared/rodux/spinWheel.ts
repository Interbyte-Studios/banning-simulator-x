import Rodux from "@rbxts/rodux";

export interface SpinWheelState {
	totalSpins: number;
	spinsAvailable: number;
	purchasedSpinsAvailable: number;
	lastSpinTime: number;
}

export type SpinWheelActions = SpinTheWheel | AddAvailableSpins | AddPurchasedSpins;

interface SpinTheWheel extends Rodux.Action<"spinTheWheel"> {
	timeSpun: number;
	purchased: boolean;
}

interface AddAvailableSpins extends Rodux.Action<"addAvailableSpins"> {
	amount: number;
}

interface AddPurchasedSpins extends Rodux.Action<"addPurchasedSpins"> {
	amount: number;
}

/**
 * @param timeSpun The time the wheel was spun.
 * @param purchased Whether or not a purchased spin was used.
 * @returns The Rodux action to dispatch.
 */
export function spinTheWheel(timeSpun: number, purchased: boolean): SpinTheWheel & Rodux.AnyAction {
	return {
		type: "spinTheWheel",
		timeSpun: timeSpun,
		purchased,
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

/**
 * @param amount The amount of spins to add.
 * @returns The Rodux action to dispatch.
 */
export function addPurchasedSpins(amount: number): AddPurchasedSpins & Rodux.AnyAction {
	return {
		type: "addPurchasedSpins",
		amount,
	};
}

export const defaultSpinWheel: SpinWheelState = {
	totalSpins: 0,
	spinsAvailable: 0,
	purchasedSpinsAvailable: 0,
	lastSpinTime: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const spinWheelReducer = Rodux.createReducer<SpinWheelState, SpinWheelActions>(defaultSpinWheel, {
	spinTheWheel: (state, action) => {
		return {
			...state,
			totalSpins: state.totalSpins + 1,
			spinsAvailable: action.purchased ? state.spinsAvailable : state.spinsAvailable - 1,
			purchasedSpinsAvailable: action.purchased ? state.purchasedSpinsAvailable - 1 : state.purchasedSpinsAvailable,
			lastSpinTime: action.purchased ? state.lastSpinTime : action.timeSpun,
		};
	},
	addAvailableSpins: (state, action) => {
		return {
			...state,
			spinsAvailable: state.spinsAvailable + action.amount,
		};
	},
	addPurchasedSpins: (state, action) => {
		return {
			...state,
			purchasedSpinsAvailable: state.purchasedSpinsAvailable + action.amount,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
