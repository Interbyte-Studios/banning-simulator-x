/// <reference types="@rbxts/testez/globals" />

import { currentAuraReducer, CurrentAuraState, equipAura } from "../currentAura";

export = (): void => {
	describe("rodux/currentAura", () => {
		it("should allow equipping an aura", () => {
			const oldAuraId = 1;
			const newauraId = 2;

			const state: CurrentAuraState = oldAuraId;

			const action = equipAura(newauraId);

			expect(currentAuraReducer(state, action)).to.equal(newauraId);
		});
	});
};
