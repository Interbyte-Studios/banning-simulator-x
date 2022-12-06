/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";
import { equipWeapon } from "shared/rodux/currentWeapon";

export = (): void => {
	describe("equipWeapon", () => {
		it("should allow equipping a weapon", () => {
			const weaponData = {
				id: 1,
				bans: 0,
			};

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				currentWeapon: {
					id: 1,
					equipped: false,
				},
				weapons: [weaponData],
			});

			store.dispatch(equipWeapon());
			assertDeepEqual(dispatchedActions, [
				{
					type: "equipWeapon",
					id: weaponData.id,
				},
			]);

			cleanup();
		});
	});
};
