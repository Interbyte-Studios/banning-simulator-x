import { remotes } from "shared/remotes";

const namespace = remotes.Client.GetNamespace("worldPrestige");

/**
 * Remotes for world prestige.
 */
export const worldPrestigeRemotes = {
	claimPrestige: namespace.Get("claimPrestige"),
	purchasePrestigeBoost: namespace.Get("purchasePrestigeBoost"),
	purchaseWorldPrestigeCurrencyUpgrade: namespace.Get("purchaseWorldPrestigeCurrencyUpgrade"),
	purchaseWorldPrestigeFusionUpgrade: namespace.Get("purchaseWorldPrestigeFusionUpgrade"),
	purchaseWorldPrestigeVoidEggUpgrade: namespace.Get("purchaseWorldPrestigeVoidEggUpgrade"),
	purchaseWorldPrestigePetsUpgrade: namespace.Get("purchaseWorldPrestigePetsUpgrade"),
};
