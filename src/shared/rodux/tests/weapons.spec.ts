/// <reference types="@rbxts/testez/globals" />

import Object from "@rbxts/object-utils";
import { currencies } from "shared/configs/currencies";

import { currenciesReducer, killNpc } from "../currencies";
import { purchaseWeapon, weaponsReducer, WeaponsState } from "../weapons";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/weapons", () => {
		it("should allow purchasing a weapon", () => {
			const weaponData = {
				id: 1,
				bans: 0,
				level: 1,
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

			testAction(state, newState, weaponsReducer, action);
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

			testAction(state, newState, currenciesReducer, action);
		});

		it("should add experience to the equipped weapon", () => {
			const weaponData = {
				id: 1,
				bans: 0,
				level: 1,
			};

			const updatedWeaponData = {
				id: 1,
				bans: 1,
				level: 1,
			};

			const state = [weaponData];
			const newState = [updatedWeaponData];

			const action = killNpc(0, "coins", 1, weaponData.id, 1);
			testAction(state, newState, weaponsReducer, action);
		});
	});
};
