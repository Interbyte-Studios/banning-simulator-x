/// <reference types="@rbxts/testez/globals" />

import { createDummyStore } from "server/playerStore";
import { WEAPONS } from "shared/configs/weapons";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";
import { useMockPlayer } from "shared/mocks/player";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

import { purchaseWeapon } from "../purchaseWeapon";

export = (): void => {
	describe("purchaseWeapon", () => {
		it("should allow purchasing a weapon", () => {
			const weaponId = 2;

			const player = useMockPlayer();
			// give us enough coins to purchase the weapon
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				currencies: {
					coins: getWeaponInfo(weaponId).data.cost?.amount,
				},
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

		it("should not purchase a weapon already owned", () => {
			const weaponData = {
				id: 1,
				bans: 0,
			};

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {
				weapons: [weaponData],
			});

			purchaseWeapon(store, weaponData.id);
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		it("should not purchase a weapon that cannot be bought", () => {
			// weapon id 1 cannot be bought
			const weaponId = 1;
			const weaponInfo = getWeaponInfo(weaponId);
			// make sure that cost does not exist
			expect(weaponInfo.data.cost).to.equal(undefined);

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, {});

			purchaseWeapon(store, weaponId);
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});

		it("should not purchase a weapon the player cannot afford", () => {
			const weaponId = 2;

			const player = useMockPlayer();
			const { store, dispatchedActions, cleanup } = createDummyStore(player, { currencies: { coins: 500 } });
			purchaseWeapon(store, weaponId);
			assertDeepEqual(dispatchedActions, []);

			cleanup();
		});
	});
};
