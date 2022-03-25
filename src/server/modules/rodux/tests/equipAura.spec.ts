/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";

import { equipAura } from "../equipAura";

export = (): void => {
	describe("equipAura", () => {
		it("should allow equipping an aura", () => {
			const auraId = 2;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				weapons: new Set([auraId]),
			});

			equipAura(store, auraId);
			assertDeepEqual(dispatchedActions, [
				{
					type: "equipAura",
					id: auraId,
				},
			]);

			cleanup();
		});

		it("should not equip an aura not owned", () => {
			const auraId = 2;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			// should throw an error when equipping
			expect(() => equipAura(store, auraId)).to.throw();
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});
	});
};
