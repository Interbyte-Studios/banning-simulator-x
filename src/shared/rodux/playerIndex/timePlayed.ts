import Rodux from "@rbxts/rodux";

export type TimePlayedState = number;

export type TimePlayedActions = AddTimePlayed;

interface AddTimePlayed extends Rodux.Action<"addTimePlayed"> {}

/**
 * @returns The Rodux action to dispatch.
 */
export function addTimePlayed(): AddTimePlayed & Rodux.AnyAction {
	return {
		type: "addTimePlayed",
	};
}

export const defaultTimePlayedState: TimePlayedState = 0;

/* eslint-disable jsdoc/require-jsdoc */
export const timePlayedReducer = Rodux.createReducer<TimePlayedState, TimePlayedActions>(defaultTimePlayedState, {
	addTimePlayed: (state) => state + 1,
});
/* eslint-enable jsdoc/require-jsdoc */
