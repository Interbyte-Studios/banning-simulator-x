/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { WEAPONS } from "shared/configs/weapons";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";

import { purchaseWeapon } from "../purchaseWeapon";

export = (): void => {
	describe("purchaseWeapon", () => {
		it("should allow purchasing a weapon", () => {
			const weaponId = 1;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				weapons: new Set([weaponId]),
			});

			purchaseWeapon(store, weaponId);
			assertDeepEqual(dispatchedActions, [
				{
					type: "purchaseWeapon",
					id: weaponId,
					cost: WEAPONS["Basic Blade"].cost,
				},
			]);

			cleanup();
		});

		it("should not purchase a weapon the player cannot afford", () => {
			const weaponId = 1;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, { currencies: { gold: 500 } });

			// should throw an error when purchasing
			expect(() => purchaseWeapon(store, weaponId)).to.throw();
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		it("should not purchase a weapon that is owned", () => {
			const weaponId = 1;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			// should throw an error when purchasing
			expect(() => purchaseWeapon(store, weaponId)).to.throw();
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});
	});
};
