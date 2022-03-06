import Rodux from "@rbxts/rodux";

export type CurrentWeaponState = number;
export type CurrentWeaponActions = EquipWeapon;

interface EquipWeapon extends Rodux.Action<"equipWeapon"> {
	id: number;
}

/**
 *
 * @param id The weapon id that is being equipped.
 * @returns The Rodux action to dispatch.
 */
export function equipWeapon(id: number): EquipWeapon & Rodux.AnyAction {
	return {
		type: "equipWeapon",
		id,
	};
}

const defaultWeaponId = -1;

/* eslint-disable jsdoc/require-jsdoc */
export const currentWeaponReducer = Rodux.createReducer<CurrentWeaponState, CurrentWeaponActions>(defaultWeaponId, {
	equipWeapon: (state, action) => {
		return action.id;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
