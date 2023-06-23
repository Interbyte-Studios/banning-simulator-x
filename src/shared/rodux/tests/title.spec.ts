/// <reference types="@rbxts/testez/globals" />

import { equipTitle, titleReducer } from "../title";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/title", () => {
		it("should equip different title", () => {
			const state = "Admin";

			const action = equipTitle("Staff Team");
			const newState = "Staff Team";

			testAction(state, newState, titleReducer, action);
		});

		it("should equip title for first time", () => {
			const state = undefined;

			const action = equipTitle("Admin");

			const newState = "Admin";

			testAction(state, newState, titleReducer, action);
		});
	});
};
