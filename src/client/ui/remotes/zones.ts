import { remotes } from "shared/remotes";

/**
 * Remotes for zones.
 */
export const zonesRemotes = {
	purchaseZone: remotes.Client.Get("purchaseZone"),
	purchaseWorld: remotes.Client.Get("purchaseWorld"),
};
