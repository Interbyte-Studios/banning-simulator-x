import Rodux from "@rbxts/rodux";

export type JoinDateState = DateTime;
export type JoinDateActions = SetJoinDate;

interface SetJoinDate extends Rodux.Action<"setJoinDate"> {
	date: DateTime;
}

/**
 * @param date The player's join date.
 * @returns The Rodux action to dispatch.
 */
export function setJoinDate(date: DateTime): SetJoinDate & Rodux.AnyAction {
	return {
		type: "setJoinDate",
		date,
	};
}

export const defaultJoinDateState: JoinDateState = DateTime.fromUnixTimestamp(0);
/* eslint-disable jsdoc/require-jsdoc */
export const joinDateReducer = Rodux.createReducer<JoinDateState, JoinDateActions>(defaultJoinDateState, {
	setJoinDate: (_, action) => action.date,
});
/* eslint-enable jsdoc/require-jsdoc */
