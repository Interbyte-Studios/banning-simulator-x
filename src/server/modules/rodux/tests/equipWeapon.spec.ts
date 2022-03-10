/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";

import { equipWeapon } from "../equipWeapon";

export = (): void => {
	describe("equipWeapon", () => {
		it("should allow equipping a weapon", () => {
			const weaponId = 2;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				weapons: new Set([weaponId]),
			});

			equipWeapon(store, weaponId);
			assertDeepEqual(dispatchedActions, [
				{
					type: "equipWeapon",
					id: weaponId,
				},
			]);

			cleanup();
		});

		it("should not equip a weapon not owned", () => {
			const weaponId = 2;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			// should throw an error when equipping
			expect(() => equipWeapon(store, weaponId)).to.throw();
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});
	});
};
