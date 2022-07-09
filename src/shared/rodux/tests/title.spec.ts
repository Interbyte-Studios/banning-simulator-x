/// <reference types="@rbxts/testez/globals" />

import { equipTitle, titleReducer, TitleState } from "../title";

export = (): void => {
	describe("rodux/title", () => {
		it("should equip different title", () => {
			const state: TitleState = "500 exp";

			const action = equipTitle("free title!");

			expect(titleReducer(state, action)).to.equal("free title!");
		});

		it("should equip title for first time", () => {
			const state: TitleState = undefined;

			const action = equipTitle("500 exp");

			expect(titleReducer(state, action)).to.equal("500 exp");
		});
	});
};
