/// <reference types="@rbxts/testez/globals" />

import Object from "@rbxts/object-utils";
import { currencies } from "shared/configs/currencies";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { currenciesReducer, killNpc } from "../currencies";
import { purchaseWeapon, weaponsReducer, WeaponsState } from "../weapons";

export = (): void => {
	describe("rodux/weapons", () => {
		it("should allow purchasing a weapon", () => {
			const weaponData = {
				id: 1,
				bans: 0,
			};

			const state: WeaponsState = [];
			const newState: WeaponsState = [weaponData];

			const action = purchaseWeapon({
				id: weaponData.id,
				cost: {
					amount: 1000,
					currency: "coins",
				},
			});

			assertDeepEqual(weaponsReducer(state, action), newState);
		});

		it("should take away currency purchasing a weapon", () => {
			const cost = 100;

			const state = Object.fromEntries(Object.values(currencies).map((currency) => [currency, cost] as const));
			const newState = { ...state, ["coins"]: 0 };

			const action = purchaseWeapon({
				id: 1,
				cost: {
					amount: cost,
					currency: "coins",
				},
			});

			assertDeepEqual(currenciesReducer(state, action), newState);
		});

		it("should add experience to the equipped weapon", () => {
			const weaponData = {
				id: 1,
				bans: 0,
			};

			const updatedWeaponData = {
				id: 1,
				bans: 1,
			};

			const state: WeaponsState = [weaponData];
			const newState: WeaponsState = [updatedWeaponData];

			const action = killNpc(0, "coins", 1, weaponData.id, 1);
			assertDeepEqual(weaponsReducer(state, action), newState);
		});
	});
};
