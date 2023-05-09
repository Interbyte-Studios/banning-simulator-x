import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("weapons");

/**
 * Remotes for the weapons UI.
 */
export const weaponsRemotes = {
	changeWeapon: remoteNamespace.Get("changeWeapon"),
	equipWeapon: remoteNamespace.Get("equipWeapon"),
	unequipWeapon: remoteNamespace.Get("unequipWeapon"),
	purchaseWeapon: remoteNamespace.Get("purchaseWeapon"),
};
