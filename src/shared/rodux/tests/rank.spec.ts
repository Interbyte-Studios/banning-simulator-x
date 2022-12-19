/// <reference types="@rbxts/testez/globals" />

import { rankReducer, unlockRank } from "../rank";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/rank", () => {
		it("should allow unlocking a rank", () => {
			const oldRankId = 1;
			const newRankId = 2;

			const action = unlockRank(newRankId, "coins", 0);

			testAction(oldRankId, newRankId, rankReducer, action);
		});
	});
};
