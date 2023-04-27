/// <reference types="@rbxts/testez/globals" />
import { createDummyStore } from "server/playerStore";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";

import { redeemQuest } from "../redeemQuest";

export = (): void => {
	describe("redeemQuest", () => {
		it("should redeem a title quest", () => {
			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			redeemQuest(store, "Kill 30 mobs");
			assertDeepEqual(dispatchedActions, [
				{
					type: "redeemQuest",
					name: "Kill 30 mobs",
					experience: 50,
					rewardType: {
						kind: "title",
					},
					questType: {
						world: "Ban Land",
					},
				},
			]);

			cleanup();
		});

		it("should throw if quest was not valid", () => {
			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			expect(() => redeemQuest(store, "a random quest name")).to.throw();
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		it("should not redeem a quest a user has not completed all progress for", () => {
			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			redeemQuest(store, "Kill 15 mobs");
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		// todo: add test case for currency quest
		// todo: add test case for pet quest
	});
};
