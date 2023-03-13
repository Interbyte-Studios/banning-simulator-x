import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { WEAPON_LEVELS } from "shared/configs/weapons";

import { KillNpc } from "./currencies";

export type Weapon = { id: number; bans: number; level: number };
export type WeaponsState = Array<Weapon>;
export type WeaponsActions = PurchaseWeapon | Admin_ModifyWeaponLevel;

export interface PurchaseWeapon extends Rodux.Action<"purchaseWeapon"> {
	cost: {
		currency: Currency;
		amount: number;
	};
	id: number;
}

export interface Admin_ModifyWeaponLevel extends Rodux.Action<"admin_ModifyWeaponLevel"> {
	weaponId: number;
	level: number;
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

/**
 * Modifies the level of a weapon.
 *
 * @param weaponId The id of the weapon to modify.
 * @param level The level to set the weapon to.
 * @returns The Rodux action to dispatch.
 */
export function admin_ModifyWeaponLevel(weaponId: number, level: number): Admin_ModifyWeaponLevel & Rodux.AnyAction {
	return {
		type: "admin_ModifyWeaponLevel",
		weaponId,
		level,
	};
}

const defaulWeapon = {
	id: 1,
	bans: 0,
	level: 1,
};

const defaultState: WeaponsState = [defaulWeapon];

/* eslint-disable jsdoc/require-jsdoc */
export const weaponsReducer = Rodux.createReducer<WeaponsState, WeaponsActions | KillNpc>(defaultState, {
	purchaseWeapon: (state, action) => {
		const newWeapon = {
			id: action.id,
			bans: 0,
			level: 1,
		};

		const newState = [...state, newWeapon];

		return newState;
	},
	killNpc: (state, action) => {
		const newState = [...state];

		const currentWeaponIndex = newState.findIndex((weapon) => weapon.id === action.weaponId);
		if (currentWeaponIndex === undefined) {
			throw `Expected player to own the weapon ${action.weaponId}`;
		}

		const newCurrentWeapon = { ...newState[currentWeaponIndex] };

		newCurrentWeapon.bans += 1;

		WEAPON_LEVELS.forEach((levelData) => {
			if (newCurrentWeapon.level >= levelData.level) {
				return;
			}

			if (newCurrentWeapon.bans >= levelData.requiredBans) {
				newCurrentWeapon.level = levelData.level;
			}
		});

		newState[currentWeaponIndex] = newCurrentWeapon;

		return newState;
	},
	admin_ModifyWeaponLevel: (state, action) => {
		const newState = [...state];

		const currentWeaponIndex = newState.findIndex((weapon) => weapon.id === action.weaponId);
		if (currentWeaponIndex === undefined) {
			throw `Expected player to own the weapon ${action.weaponId}`;
		}

		const newCurrentWeapon = { ...newState[currentWeaponIndex] };

		newCurrentWeapon.level = action.level;

		newState[currentWeaponIndex] = newCurrentWeapon;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
