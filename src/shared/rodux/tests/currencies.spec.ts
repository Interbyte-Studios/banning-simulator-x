/// <reference types="@rbxts/testez/globals" />

import { currenciesReducer, killNpc } from "../currencies";
import { experienceReducer } from "../experience";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/currencies", () => {
		it("should increase currency for npc kill", () => {
			const currencyAmount = 100;

			const state = { coins: 10, gems: 10 };
			const newState = { coins: state.coins + currencyAmount, gems: 10 };

			const action = killNpc(currencyAmount, "coins", 1, 0, 1, 1, 1, []);
			testAction(state, newState, currenciesReducer, action);
		});

		it("should reward experience for npc kill", () => {
			const experienceAmount = 25;

			const state = 250;
			const newState = state + experienceAmount;

			const action = killNpc(50, "coins", 1, experienceAmount, 1, 1, 1, []);
			testAction(state, newState, experienceReducer, action);
		});
	});
};
