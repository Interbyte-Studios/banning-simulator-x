/// <reference types="@rbxts/testez/globals" />

import { BoostProduct } from "shared/configs/game";

import { boostsReducer, claimBoost, useBoosts, ValidBoostTime } from "../boosts";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/boosts", () => {
		it("should allow claiming a boost", () => {
			const defaultBoost = 0;
			const claimedBoostTime: ValidBoostTime = 120;

			const state = {
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
				uses: 0,
			};

			const newState = {
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
				uses: 0,
			};

			const action = claimBoost("x2 Currency", claimedBoostTime, 1);

			testAction(state, newState, boostsReducer, action);
		});

		it("should allow using a boost", () => {
			const boostTime = 6 * 60;
			const boostsToUse: Array<BoostProduct> = [
				"x2 Currency",
				"x2 Rank Experience",
				"x2 Pet Experience",
				"x2 Hatching Luck",
			];

			const state = {
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
					["x2 Pet Experience"]: boostTime,
					["x2 Hatching Luck"]: boostTime,
				},
				uses: 0,
			};

			const newState = {
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
					["x2 Hatching Luck"]: {
						15: 0,
						30: 0,
						60: 0,
						120: 0,
					},
				},
				active: {
					["x2 Currency"]: boostTime - 1,
					["x2 Rank Experience"]: boostTime - 1,
					["x2 Pet Experience"]: boostTime - 1,
					["x2 Hatching Luck"]: boostTime - 1,
				},
				uses: 0,
			};

			const action = useBoosts(boostsToUse);

			testAction(state, newState, boostsReducer, action);
		});
	});
};
