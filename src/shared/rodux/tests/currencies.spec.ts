/// <reference types="@rbxts/testez/globals" />

import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { currenciesReducer, CurrenciesState, killNpc } from "../currencies";
import { experienceReducer, ExperienceState } from "../experience";

export = (): void => {
	describe("rodux/currencies", () => {
		it("should increase currency for npc kill", () => {
			const currencyAmount = 100;

			const state: CurrenciesState = { coins: 10, gems: 10 };
			const newState: CurrenciesState = { coins: state.coins + currencyAmount, gems: 10 };

			const action = killNpc(currencyAmount, "coins", 0, 1, 1);

			assertDeepEqual(currenciesReducer(state, action), newState);
		});

		it("should reward experience for npc kill", () => {
			const experienceAmount = 25;

			const state: ExperienceState = 250;
			const newState: ExperienceState = state + experienceAmount;

			const action = killNpc(50, "coins", experienceAmount, 1, 1);
			expect(experienceReducer(state, action)).to.equal(newState);
		});
	});
};
