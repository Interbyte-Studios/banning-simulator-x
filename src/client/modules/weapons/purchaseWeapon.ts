import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { PurchaseWeaponDefinition } from "shared/remotes/weapons/purchaseWeapon";
import { Store } from "shared/rodux";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

/**
 * Handles the purchasing of a new weapon.
 *
 * @param store The player's store.
 * @param weaponId The ID of the weapon to purchase.
 * @param purchaseWeaponRemote The purchase weapon remote.
 */
export function purchaseWeapon(
	store: Store,
	weaponId: number,
	purchaseWeaponRemote: InferClientRemote<PurchaseWeaponDefinition>,
): void {
	// check to be sure weapon isn't already owned
	const isOwned = store.getState().weapons.find((weapon) => weapon.id === weaponId);
	assert(!isOwned, `Expected player to not own weapon "${weaponId}"`);

	// get weapon info
	const weaponInfo = getWeaponInfo(weaponId);

	// check to be sure weapon can be purchased
	assert(weaponInfo.data.cost !== undefined, `Weapon "${weaponId}" was not purchaseable`);

	// check to be sure player has enough currency to purchase weapon
	if (store.getState().currencies[weaponInfo.data.cost.currency] < weaponInfo.data.cost.amount) {
		warn(`Not enough currency to purchase "${weaponId}"`);
		return;
	}

	// send to server to request the purchase of the weapon
	purchaseWeaponRemote.SendToServer(weaponId);
}
