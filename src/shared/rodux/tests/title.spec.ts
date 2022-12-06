/// <reference types="@rbxts/testez/globals" />

import { equipTitle, titleReducer } from "../title";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/title", () => {
		it("should equip different title", () => {
			const state = "500 exp";

			const action = equipTitle("free title!");
			const newState = "free title!";

			testAction(state, newState, titleReducer, action);
		});

		it("should equip title for first time", () => {
			const state = undefined;

			const action = equipTitle("500 exp");

			const newState = "500 exp";

			testAction(state, newState, titleReducer, action);
		});
	});
};
