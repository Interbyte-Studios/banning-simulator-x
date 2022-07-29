/// <reference types="@rbxts/testez/globals" />

import { BoostProduct } from "shared/configs/game";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { boostsReducer, BoostsState, claimBoost, useBoosts } from "../boosts";

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

		it("should allow using a boost", () => {
			const boostTime = 6 * 60;
			const boostsToUse: Array<BoostProduct> = [
				"x2 Boss Drop Luck",
				"x2 Currency",
				"x2 Experience",
				"x2 Pet Experience",
			];

			const state: BoostsState = {
				["x2 Boss Drop Luck"]: boostTime,
				["x2 Currency"]: boostTime,
				["x2 Experience"]: boostTime,
				["x2 Pet Experience"]: boostTime,
			};

			const newState = { ...state };
			for (const boost of boostsToUse) {
				newState[boost] -= 1;
			}

			const action = useBoosts(boostsToUse);

			assertDeepEqual(boostsReducer(state, action), newState);
		});
	});
};
