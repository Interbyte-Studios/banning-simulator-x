/// <reference types="@rbxts/testez/globals" />

import Object from "@rbxts/object-utils";
import { currencies } from "shared/configs/currencies";
import { assertDeepEqual } from "shared/mocks/assertDeepEqual";

import { currenciesReducer, killNpc } from "../currencies";
import { purchaseWeapon, weaponsReducer, WeaponsState } from "../weapons";

export = (): void => {
	describe("rodux/weapons", () => {
		it("should allow purchasing a weapon", () => {
			const weaponId = 1;

			const state: WeaponsState = new Map();
			const newState: WeaponsState = new Map([[weaponId, { bans: 0 }]]);

			const action = purchaseWeapon({
				id: weaponId,
				cost: {
					amount: 1000,
					currency: "gold",
				},
			});

			assertDeepEqual(weaponsReducer(state, action), newState);
		});

		it("should take away currency purchasing a weapon", () => {
			const cost = 100;

			const state = Object.fromEntries(Object.values(currencies).map((currency) => [currency, cost] as const));
			const newState = { ...state, ["gold"]: 0 };

			const action = purchaseWeapon({
				id: 1,
				cost: {
					amount: cost,
					currency: "gold",
				},
			});

			assertDeepEqual(currenciesReducer(state, action), newState);
		});

		it("should add experience to the equipped weapon", () => {
			const weaponId = 1;

			const state: WeaponsState = new Map([[weaponId, { bans: 0 }]]);
			const newState: WeaponsState = new Map([[weaponId, { bans: 1 }]]);

			const action = killNpc(0, "gold", 1, weaponId, 1);
			assertDeepEqual(weaponsReducer(state, action), newState);
		});
	});
};
