/// <reference types="@rbxts/testez/globals" />

import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { boostsReducer, BoostsState, claimBoost } from "../boosts";

export = (): void => {
	describe("rodux/boosts", () => {
		it("should allow claiming a boost", () => {
			const defaultBoost = 0;
			const claimedBoostTime = 6 * 60;

			const state: BoostsState = {
				["x2 Boss Drop Luck"]: defaultBoost,
				["x2 Currency"]: defaultBoost,
				["x2 Experience"]: defaultBoost,
				["x2 Pet Experience"]: defaultBoost,
			};

			const newState: BoostsState = {
				["x2 Boss Drop Luck"]: claimedBoostTime,
				["x2 Currency"]: defaultBoost,
				["x2 Experience"]: defaultBoost,
				["x2 Pet Experience"]: defaultBoost,
			};

			const action = claimBoost("x2 Boss Drop Luck", claimedBoostTime);

			assertDeepEqual(boostsReducer(state, action), newState);
		});
	});
};
