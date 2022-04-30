/// <reference types="@rbxts/testez/globals" />

import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { currenciesReducer, CurrenciesState, killNpc } from "../currencies";
import { experienceReducer, ExperienceState } from "../experience";

export = (): void => {
	describe("rodux/currencies", () => {
		it("should increase currency for npc kill", () => {
			const currencyAmount = 100;

			const state: CurrenciesState = { gold: 10 };
			const newState: CurrenciesState = { gold: state.gold + currencyAmount };

			const action = killNpc(currencyAmount, "gold", 0, 1);

			assertDeepEqual(currenciesReducer(state, action), newState);
		});

		it("should reward experience for npc kill", () => {
			const state: ExperienceState = 250;

			const experienceAmount = 25;

			const action = killNpc(50, "gold", experienceAmount, 1);
			expect(experienceReducer(state, action)).to.equal(experienceAmount);
		});
	});
};
