import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";

import { KillNpc } from "./currencies";

export type WeaponsState = Array<{ id: number; bans: number }>;
export type WeaponsActions = PurchaseWeapon;

export interface PurchaseWeapon extends Rodux.Action<"purchaseWeapon"> {
	cost: {
		currency: Currency;
		amount: number;
	};
	id: number;
}

/**
 * Purchases a weapon from the store, saving it to the players weapon inventory.
 *
 * @param data The data associated with the weapon purchase.
 * @returns The Rodux action to dispatch.
 */
export function purchaseWeapon(data: Omit<PurchaseWeapon, "type">): PurchaseWeapon & Rodux.AnyAction {
	return {
		type: "purchaseWeapon",
		id: data.id,
		cost: data.cost,
	};
}

const defaulWeapon = {
	id: 1,
	bans: 0,
};
const defaultState: WeaponsState = [defaulWeapon];

/* eslint-disable jsdoc/require-jsdoc */
export const weaponsReducer = Rodux.createReducer<WeaponsState, WeaponsActions | KillNpc>(defaultState, {
	purchaseWeapon: (state, action) => {
		const newWeapon = {
			id: action.id,
			bans: 0,
		};

		const newState = [...state];
		newState.push(newWeapon);

		return newState;
	},
	killNpc: (state, action) => {
		const newState = [...state];

		const currentWeapon = newState.find((weapon) => weapon.id === action.weaponId);
		if (currentWeapon === undefined) {
			throw `Expected player to own the weapon ${action.weaponId}`;
		}

		const increasedWeaponBanCounter = currentWeapon.bans + 1;
		currentWeapon.bans = increasedWeaponBanCounter;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
