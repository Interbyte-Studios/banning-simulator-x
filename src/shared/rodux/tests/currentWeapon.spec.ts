/// <reference types="@rbxts/testez/globals" />

import { currentWeaponReducer, CurrentWeaponState, equipWeapon } from "../currentWeapon";

export = (): void => {
	describe("rodux/currentWeapon", () => {
		it("should allow equipping a weapon", () => {
			const oldWeaponId = 1;
			const newWeaponId = 2;

			const state: CurrentWeaponState = oldWeaponId;

			const action = equipWeapon(newWeaponId);

			expect(currentWeaponReducer(state, action)).to.equal(newWeaponId);
		});
	});
};
