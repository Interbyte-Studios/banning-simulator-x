import { Store } from "shared/rodux";
import { purchaseWeapon as dispatchPurchaseWeapon } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

/**
 * Purchases a weapon for a player.
 *
 * @param store The store to equip the weapon for.
 * @param weaponId The ID of the weapon to equip.
 */
export function purchaseWeapon(store: Store, weaponId: number): void {
	// check if player owns weapon
	if (store.getState().weapons.find((weapon) => weapon.id === weaponId)) {
		return;
	}

	// get weapon info
	const weaponInfo = getWeaponInfo(weaponId);

	// check to be sure weapon can be purchased
	if (weaponInfo.data.cost === undefined) {
		return;
	}

	// check to be sure player has enough currency to purchase weapon
	if (store.getState().currencies[weaponInfo.data.cost.currency] < weaponInfo.data.cost.amount) {
		return;
	}

	// check to be sure they're the proper rank
	if (weaponInfo.data.cost.requiredRank !== undefined && store.getState().rank < weaponInfo.data.cost.requiredRank) {
		return;
	}

	// purchase weapon
	store.dispatch(
		dispatchPurchaseWeapon({
			cost: weaponInfo.data.cost,
			id: weaponId,
		}),
	);
}
