/// <reference types="@rbxts/testez/globals" />

import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { settingsReducer, SettingsState, toggleAuto } from "../settings";

export = (): void => {
	describe("rodux/settings", () => {
		it("should toggle auto hatch", () => {
			const state: SettingsState = {
				autoHatch: false,
			};

			const newState: SettingsState = { ...state };
			newState.autoHatch = true;

			const action = toggleAuto();

			assertDeepEqual(settingsReducer(state, action), newState);
		});
	});
};
