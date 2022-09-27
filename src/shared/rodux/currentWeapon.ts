import Rodux from "@rbxts/rodux";

export type CurrentWeaponState = {
	id: number;
	equipped: boolean;
};
export type CurrentWeaponActions = ChangeWeapon | EquipWeapon | UnequipWeapon;

interface ChangeWeapon extends Rodux.Action<"changeWeapon"> {
	id: number;
}
interface EquipWeapon extends Rodux.Action<"equipWeapon"> {}
interface UnequipWeapon extends Rodux.Action<"unequipWeapon"> {}

/**
 * @param id The weapon to equip.
 * @returns The Rodux action to dispatch.
 */
export function changeWeapon(id: number): ChangeWeapon & Rodux.AnyAction {
	return {
		type: "changeWeapon",
		id,
	};
}

/**
 * @returns The Rodux action to dispatch.
 */
export function equipWeapon(): EquipWeapon & Rodux.AnyAction {
	return {
		type: "equipWeapon",
	};
}

/**
 * @returns The Rodux action to dispatch.
 */
export function unequipWeapon(): UnequipWeapon & Rodux.AnyAction {
	return {
		type: "unequipWeapon",
	};
}

const defaultWeaponState = {
	id: 11,
	equipped: true,
};

/* eslint-disable jsdoc/require-jsdoc */
export const currentWeaponReducer = Rodux.createReducer<CurrentWeaponState, CurrentWeaponActions>(defaultWeaponState, {
	changeWeapon: (state, action) => {
		return {
			id: action.id,
			equipped: true,
		};
	},
	equipWeapon: (state) => {
		return {
			...state,
			equipped: true,
		};
	},
	unequipWeapon: (state) => {
		return {
			...state,
			equipped: false,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
