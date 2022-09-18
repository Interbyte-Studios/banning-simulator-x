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
				storage: {
					["x2 Currency"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Rank Experience"]: {
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
					["x2 Talisman Experience"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Hatching Luck"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
				},
				active: {
					["x2 Currency"]: defaultBoost,
					["x2 Rank Experience"]: defaultBoost,
					["x2 Talisman Experience"]: defaultBoost,
					["x2 Pet Experience"]: defaultBoost,
					["x2 Hatching Luck"]: defaultBoost,
				},
			};

			const newState: BoostsState = {
				storage: {
					["x2 Currency"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Rank Experience"]: {
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
					["x2 Talisman Experience"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Hatching Luck"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
				},
				active: {
					["x2 Currency"]: claimedBoostTime,
					["x2 Rank Experience"]: defaultBoost,
					["x2 Talisman Experience"]: defaultBoost,
					["x2 Pet Experience"]: defaultBoost,
					["x2 Hatching Luck"]: defaultBoost,
				},
			};

			const action = claimBoost("x2 Currency", claimedBoostTime);

			assertDeepEqual(boostsReducer(state, action), newState);
		});

		it("should allow using a boost", () => {
			const boostTime = 6 * 60;
			const boostsToUse: Array<BoostProduct> = [
				"x2 Currency",
				"x2 Rank Experience",
				"x2 Talisman Experience",
				"x2 Pet Experience",
				"x2 Hatching Luck",
			];

			const state: BoostsState = {
				storage: {
					["x2 Currency"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Rank Experience"]: {
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
					["x2 Talisman Experience"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
					["x2 Hatching Luck"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
				},
				active: {
					["x2 Currency"]: boostTime,
					["x2 Rank Experience"]: boostTime,
					["x2 Talisman Experience"]: boostTime,
					["x2 Pet Experience"]: boostTime,
					["x2 Hatching Luck"]: boostTime,
				},
			};

			const newState: BoostsState = { ...state };
			for (const boost of boostsToUse) {
				newState.active[boost] -= 1;
			}

			const action = useBoosts(boostsToUse);

			assertDeepEqual(boostsReducer(state, action), newState);
		});
	});
};
