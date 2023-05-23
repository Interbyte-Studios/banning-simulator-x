import { ChangeWeaponDefinition } from "shared/remotes/weapons/changeWeapon";
import { EquipWeaponDefinition } from "shared/remotes/weapons/equipWeapon";
import { PurchaseWeaponDefinition } from "shared/remotes/weapons/purchaseWeapon";
import { UnequipWeaponDefinition } from "shared/remotes/weapons/unequipWeapon";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 * This is the remote context for the weapons remote functions.
 */
export const weaponsRemoteContext = {
	changeWeapon: fakeRemoteCall<ChangeWeaponDefinition>("changeWeapon"),
	equipWeapon: fakeRemoteCall<EquipWeaponDefinition>("equipWeapon"),
	unequipWeapon: fakeRemoteCall<UnequipWeaponDefinition>("unequipWeapon"),
	purchaseWeapon: fakeRemoteCall<PurchaseWeaponDefinition>("purchaseWeapon"),
};
