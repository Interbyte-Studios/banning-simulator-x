import { Store } from "shared/rodux";
import { purchaseWeapon as dispatchPurchaseWeapon } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

/**
 * Purchases a weapon for a player.
 *
 * @param store The store to equip the weapon for.
 * @param weaponId The ID of the weapon to equip.
 * @returns Whether or not the purchase was successful.
 */
export function purchaseWeapon(store: Store, weaponId: number): boolean {
	// check if player owns weapon
	if (store.getState().weapons.has(weaponId)) {
		return false;
	}

	// get weapon info
	const weaponInfo = getWeaponInfo(weaponId);

	// check to be sure weapon can be purchased
	if (weaponInfo.cost === undefined) {
		return false;
	}

	// todo: check to be sure that player has enough currency

	// purchase weapon
	store.dispatch(
		dispatchPurchaseWeapon({
			cost: {
				currency: weaponInfo.cost.currency,
				amount: weaponInfo.cost.amount,
			},
			id: weaponId,
		}),
	);

	return true;
}
