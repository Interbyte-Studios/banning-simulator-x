/// <reference types="@rbxts/testez/globals" />

import { currentAuraReducer, CurrentAuraState, equipAura } from "../currentAura";

export = (): void => {
	describe("rodux/currentAura", () => {
		it("should allow equipping an aura", () => {
			const oldAuraId = 1;
			const newAuraId = 2;

			const state: CurrentAuraState = oldAuraId;

			const action = equipAura(newAuraId);

			expect(currentAuraReducer(state, action)).to.equal(newAuraId);
		});
	});
};
