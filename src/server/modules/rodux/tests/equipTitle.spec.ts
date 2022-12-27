/// <reference types="@rbxts/testez/globals" />

/*
import { createDummyStore } from "server/playerStore";
import { ValidTitle } from "shared/configs/titles";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";

import { equipTitle } from "../equipTitle";
*/

export = (): void => {
	describe("equipTitle", () => {
		/*
		it("should allow equipping a title with pre-requisites met", () => {
			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				eggs: {
					eggs: 50000,
				},
			});

			equipTitle(store, "Pet Incubator");
			assertDeepEqual(dispatchedActions, [
				{
					type: "equipTitle",
					title: "Pet Incubator",
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

			equipTitle(store, "Executive");
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});
		*/
	});
};
