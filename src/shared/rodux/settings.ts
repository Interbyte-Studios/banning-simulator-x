import Rodux from "@rbxts/rodux";

interface Settings {
	autoHatch: boolean;
}

export type SettingsState = Settings;
export type SettingsActions = ToggleAuto;

interface ToggleAuto extends Rodux.Action<"toggleAuto"> {}

/**
 * @returns The Rodux action to dispatch.
 */
export function toggleAuto(): ToggleAuto & Rodux.AnyAction {
	return {
		type: "toggleAuto",
	};
}

const defaultSettings: Settings = {
	autoHatch: false,
};

/* eslint-disable jsdoc/require-jsdoc */
export const settingsReducer = Rodux.createReducer<SettingsState, SettingsActions>(defaultSettings, {
	toggleAuto: (state) => {
		const newState: Settings = { ...state };
		newState.autoHatch = !newState.autoHatch;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
