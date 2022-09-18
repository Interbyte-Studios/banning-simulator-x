/// <reference types="@rbxts/testez/globals" />

import { BoostProduct } from "shared/configs/game";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { boostsReducer, claimBoost, useBoosts } from "../boosts";

export = (): void => {
	describe("rodux/boosts", () => {
		it("should allow claiming a boost", () => {
			const defaultBoost = 0;
			const claimedBoostTime = 6 * 60;

			const state = {
				storage: {
					["x2 Boss Drop Luck"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Currency"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Experience"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Pet Experience"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
				},
				active: {
					["x2 Boss Drop Luck"]: defaultBoost,
					["x2 Currency"]: defaultBoost,
					["x2 Experience"]: defaultBoost,
					["x2 Pet Experience"]: defaultBoost,
				},
			};

			const newState = {
				storage: {
					["x2 Boss Drop Luck"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Currency"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Experience"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Pet Experience"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
				},
				active: {
					["x2 Boss Drop Luck"]: claimedBoostTime,
					["x2 Currency"]: defaultBoost,
					["x2 Experience"]: defaultBoost,
					["x2 Pet Experience"]: defaultBoost,
				},
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

			const state = {
				storage: {
					["x2 Boss Drop Luck"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Currency"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Experience"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Pet Experience"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
				},
				active: {
					["x2 Boss Drop Luck"]: boostTime,
					["x2 Currency"]: boostTime,
					["x2 Experience"]: boostTime,
					["x2 Pet Experience"]: boostTime,
				},
			};

			const newState = { ...state };
			for (const boost of boostsToUse) {
				newState.active[boost] -= 1;
			}

			const action = useBoosts(boostsToUse);

			assertDeepEqual(boostsReducer(state, action), newState);
		});
	});
};
