import { remotes } from "shared/remotes";
import { Store } from "shared/rodux";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

const purchaseWeaponRemote = remotes.Client.GetNamespace("weapons").Get("purchaseWeapon");

/**
 * Handles the purchasing of a new weapon.
 *
 * @param store The player's store.
 * @param weaponId The ID of the weapon to purchase.
 */
export function purchaseWeapon(store: Store, weaponId: number): void {
	// check to be sure weapon isn't already owned
	const isOwned = store.getState().weapons.has(weaponId);
	assert(isOwned, `Expected player to own weapon of id ${weaponId}`);

	// get weapon info
	const weaponInfo = getWeaponInfo(weaponId);

	// check to be sure weapon can be purchased
	assert(weaponInfo.data.cost !== undefined, `Weapon: ${weaponId} - Not purchaseable.`);

	// check to be sure player has enough currency to purchase weapon
	if (store.getState().currencies[weaponInfo.data.cost.currency] < weaponInfo.data.cost.amount) {
		warn(`Not enough currency to purchase ${weaponId}`);
		return;
	}

	// send to server to request the purchase of the weapon
	purchaseWeaponRemote.SendToServer(weaponId);
}
