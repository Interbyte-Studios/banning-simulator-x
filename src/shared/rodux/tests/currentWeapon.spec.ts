/// <reference types="@rbxts/testez/globals" />

import { changeWeapon, currentWeaponReducer, equipWeapon, unequipWeapon } from "../currentWeapon";

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
				equipWeapon: false,
			};

			const action = changeWeapon(newWeaponId);

			expect(currentWeaponReducer(state, action)).to.equal(newState);
		});
		it("should allow equipping a weapon", () => {
			const weaponId = 1;

			const state = {
				id: weaponId,
				equipped: false,
			};

			const newState = {
				id: weaponId,
				equipWeapon: true,
			};

			const action = equipWeapon();

			expect(currentWeaponReducer(state, action)).to.equal(newState);
		});
		it("should allow unequipping a weapon", () => {
			const weaponId = 1;

			const state = {
				id: weaponId,
				equipped: true,
			};

			const newState = {
				id: weaponId,
				equipWeapon: false,
			};

			const action = unequipWeapon();

			expect(currentWeaponReducer(state, action)).to.equal(newState);
		});
	});
};
