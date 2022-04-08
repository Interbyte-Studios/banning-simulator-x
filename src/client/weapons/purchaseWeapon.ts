import { stores } from "client/clientStores";
import { remotes } from "shared/remotes";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

const purchaseWeaponRemote = remotes.Client.GetNamespace("weapons").Get("purchaseWeapon");

/**
 * Handles the purchasing of a new weapon.
 *
 * @param player The local player.
 * @param weaponId The ID of the weapon to purchase.
 */
export async function purchaseWeapon(player: Player, weaponId: number): Promise<void> {
	// check for existing store
	const store = stores.get(player);
	if (store === undefined) {
		warn(`Did not find store for ${player.Name}`);
		return;
	}

	// check to be sure weapon isn't already owned
	const isOwned = store.getState().weapons.has(weaponId);
	if (isOwned) {
		warn(`Trying to purchase weapon ${weaponId} but it is already owned.`);
		return;
	}

	// get weapon info
	const weaponInfo = getWeaponInfo(weaponId);

	// check to be sure weapon can be purchased
	if (weaponInfo.data.cost === undefined) {
		warn(`Weapon: ${weaponId} is not purchaseable.`);
		return;
	}

	// check to be sure player has enough currency to purchase weapon
	if (store.getState().currencies[weaponInfo.data.cost.currency] < weaponInfo.data.cost.amount) {
		warn(`Not enough currency to purchase ${weaponId}`);
		return;
	}

	// send to server to request the purchase of the weapon
	await purchaseWeaponRemote.CallServerAsync(weaponId);
}
