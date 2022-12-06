/// <reference types="@rbxts/testez/globals" />

import { changeWeapon, currentWeaponReducer, equipWeapon, unequipWeapon } from "../currentWeapon";
import { testAction } from "./testAction";

export = (): void => {
	describe("rodux/currentWeapon", () => {
		it("should allow changing a weapon", () => {
			const oldWeaponId = 1;
			const newWeaponId = 2;

			const state = {
				id: oldWeaponId,
				equipped: false,
			};

			const newState = {
				id: newWeaponId,
				equipped: false,
			};

			const action = changeWeapon(newWeaponId);
			testAction(state, newState, currentWeaponReducer, action);
		});
		it("should allow equipping a weapon", () => {
			const weaponId = 1;

			const state = {
				id: weaponId,
				equipped: false,
			};

			const newState = {
				id: weaponId,
				equipped: true,
			};

			const action = equipWeapon();
			testAction(state, newState, currentWeaponReducer, action);
		});
		it("should allow unequipping a weapon", () => {
			const weaponId = 1;

			const state = {
				id: weaponId,
				equipped: true,
			};

			const newState = {
				id: weaponId,
				equipped: false,
			};

			const action = unequipWeapon();
			testAction(state, newState, currentWeaponReducer, action);
		});
	});
};
