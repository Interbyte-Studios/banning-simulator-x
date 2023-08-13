import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("rebirth");

/**
 * Remotes for rebirths.
 */
export const rebirthRemotes = {
	rebirth: remoteNamespace.Get("rebirth"),
	purchaseMagicEggs: remoteNamespace.Get("purchaseMagicEggs"),
	purchaseAdditionalEggs: remoteNamespace.Get("purchaseAdditionalEggs"),
	purchaseAdditionalPets: remoteNamespace.Get("purchaseAdditionalPets"),
	purchaseCurrencyUpgrade: remoteNamespace.Get("purchaseCurrency"),
	purchaseTeleport: remoteNamespace.Get("purchaseTeleport"),
	purchaseFastHatch: remoteNamespace.Get("purchaseFastHatch"),
	purchaseExtraLuck: remoteNamespace.Get("purchaseExtraLuck"),
};
