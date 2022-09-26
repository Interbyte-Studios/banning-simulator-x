/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";
import { equipWeapon } from "shared/rodux/currentWeapon";

export = (): void => {
	describe("equipWeapon", () => {
		it("should allow equipping a weapon", () => {
			const weaponId = 2;

			const player = useMockPlayer();
			const { dispatchedActions, cleanup } = createDummyStore(player, {
				currentWeapon: {
					id: 2,
					equipped: false,
				},
				weapons: new Set([weaponId]),
			});

			equipWeapon();
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
