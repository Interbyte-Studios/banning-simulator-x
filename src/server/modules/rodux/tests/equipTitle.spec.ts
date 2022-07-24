/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { ValidTitle } from "shared/configs/titles";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";

import { equipTitle } from "../equipTitle";

export = (): void => {
	describe("equipTitle", () => {
		it("should allow equipping a title with pre-requisites met", () => {
			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				quests: {
					"Ban Land": {
						world: new Set(["Kill 30 mobs"]),
					},
				},
			});

			equipTitle(store, "free title!");
			assertDeepEqual(dispatchedActions, [
				{
					type: "equipTitle",
					title: "free title!",
				},
			]);

			cleanup();
		});

		it("should throw if the title does not exist", () => {
			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			expect(() => equipTitle(store, "NOT A VALID TITLE" as ValidTitle)).to.throw();
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		it("should not dispatch for a title that does not have the pre-requisites met", () => {
			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			equipTitle(store, "500 exp");
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});
	});
};
