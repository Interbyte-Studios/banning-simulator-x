import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("talismans");

/**
 * Remotes for talismans.
 */
export const talismanRemotes = {
	purchaseTalisman: remoteNamespace.Get("purchaseTalisman"),
	equipTalisman: remoteNamespace.Get("equipTalisman"),
	unequipTalisman: remoteNamespace.Get("unequipTalisman"),
};
