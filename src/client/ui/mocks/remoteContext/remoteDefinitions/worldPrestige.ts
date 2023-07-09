import { ClaimWorldPrestigeDefinition } from "shared/remotes/worldPrestige/claimPrestige";
import { PurchasePrestigeBoostDefinition } from "shared/remotes/worldPrestige/purchasePrestigeBoost";
import { PurchaseWorldPrestigeCurrencyUpgradeDefinition } from "shared/remotes/worldPrestige/purchaseWorldPrestigeCurrencyUpgrade";
import { PurchaseWorldPrestigeFusionUpgradeDefinition } from "shared/remotes/worldPrestige/purchaseWorldPrestigeFusionUpgrade";
import { PurchaseWorldPrestigeVoidEggUpgradeDefinition } from "shared/remotes/worldPrestige/purchaseWorldPrestigeVoidEggUpgrade";
import { PurchaseWorldPrestigePetsUpgradeDefinition } from "shared/remotes/worldPrestige/purhcaseWorldPrestigePetsUpgrade";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the world prestige remotes.
 */
export const worldPrestigeRemoteContext = {
	claimPrestige: fakeRemoteCall<ClaimWorldPrestigeDefinition>("claimPrestige"),
	purchasePrestigeBoost: fakeRemoteCall<PurchasePrestigeBoostDefinition>("purchasePrestigeBoost"),
	purchaseWorldPrestigeCurrencyUpgrade: fakeRemoteCall<PurchaseWorldPrestigeCurrencyUpgradeDefinition>(
		"purchaseWorldPrestigeCurrencyUpgrade",
	),
	purchaseWorldPrestigeFusionUpgrade: fakeRemoteCall<PurchaseWorldPrestigeFusionUpgradeDefinition>(
		"purchaseWorldPrestigeFusionUpgrade",
	),
	purchaseWorldPrestigeVoidEggUpgrade: fakeRemoteCall<PurchaseWorldPrestigeVoidEggUpgradeDefinition>(
		"purchaseWorldPrestigeVoidEggUpgrade",
	),
	purchaseWorldPrestigePetsUpgrade: fakeRemoteCall<PurchaseWorldPrestigePetsUpgradeDefinition>(
		"purchaseWorldPrestigePetsUpgrade",
	),
};
