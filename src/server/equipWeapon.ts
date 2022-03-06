import { Store } from "shared/rodux";
import { equipWeapon as dispatchEquipWeapon } from "shared/rodux/currentWeapon";

/**
 * Equips a weapon for a player.
 *
 * ### Errors
 * Errors if the store does not own the weapon.
 *
 * @param store The store to equip the weapon for.
 * @param weaponId The ID of the weapon to equip.
 */
export function equipWeapon(store: Store, weaponId: number): void {
	// check player owns weapon
	if (!store.getState().weapons.has(weaponId)) {
		throw `${store} did not own weapon ${weaponId}`;
	}

	// equip weapon
	store.dispatch(dispatchEquipWeapon(weaponId));
}
