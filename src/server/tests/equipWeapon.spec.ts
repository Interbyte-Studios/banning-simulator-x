/// <reference types="@rbxts/testez/globals" />

import { equipWeapon } from "server/equipWeapon";
import { createDummyStore } from "server/playerStore";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";

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
	});
};
