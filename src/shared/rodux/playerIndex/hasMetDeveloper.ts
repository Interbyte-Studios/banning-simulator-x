import Rodux from "@rbxts/rodux";

export type HasMetDeveloperState = boolean;
export type HasMetDeveloperActions = SetHasMetDeveloper;

interface SetHasMetDeveloper extends Rodux.Action<"setHasMetDeveloper"> {}

/**
 * @returns The Rodux action to dispatch.
 */
export function setHasMetDeveloper(): SetHasMetDeveloper & Rodux.AnyAction {
	return {
		type: "setHasMetDeveloper",
	};
}

export const defaultHasMetDeveloperState: HasMetDeveloperState = false;
/* eslint-disable jsdoc/require-jsdoc */
export const hasMetDeveloperReducer = Rodux.createReducer<HasMetDeveloperState, HasMetDeveloperActions>(
	defaultHasMetDeveloperState,
	{
		setHasMetDeveloper: () => true,
	},
);
/* eslint-enable jsdoc/require-jsdoc */
