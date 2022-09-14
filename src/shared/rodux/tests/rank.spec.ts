/// <reference types="@rbxts/testez/globals" />

import { rankReducer, RankState, unlockRank } from "../rank";

export = (): void => {
	describe("rodux/rank", () => {
		it("should allow unlocking a rank", () => {
			const oldRankId = 1;
			const newRankId = 2;

			const state: RankState = oldRankId;

			const action = unlockRank(newRankId);

			expect(rankReducer(state, action)).to.equal(newRankId);
		});
	});
};
