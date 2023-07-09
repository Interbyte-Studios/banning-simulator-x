import Net from "@rbxts/net";

import { claimWorldPrestigeDefinition } from "./claimPrestige";
import { purchasePrestigeBoostDefinition } from "./purchasePrestigeBoost";
import { purchaseWorldPrestigeCurrencyUpgradeDefinition } from "./purchaseWorldPrestigeCurrencyUpgrade";
import { purchaseWorldPrestigeFusionUpgradeDefinition } from "./purchaseWorldPrestigeFusionUpgrade";
import { purchaseWorldPrestigeVoidEggUpgradeDefinition } from "./purchaseWorldPrestigeVoidEggUpgrade";
import { purchaseWorldPrestigePetsUpgradeDefinition } from "./purhcaseWorldPrestigePetsUpgrade";

export const worldPrestige = Net.Definitions.Namespace({
	claimPrestige: claimWorldPrestigeDefinition,
	purchasePrestigeBoost: purchasePrestigeBoostDefinition,
	purchaseWorldPrestigeCurrencyUpgrade: purchaseWorldPrestigeCurrencyUpgradeDefinition,
	purchaseWorldPrestigeFusionUpgrade: purchaseWorldPrestigeFusionUpgradeDefinition,
	purchaseWorldPrestigeVoidEggUpgrade: purchaseWorldPrestigeVoidEggUpgradeDefinition,
	purchaseWorldPrestigePetsUpgrade: purchaseWorldPrestigePetsUpgradeDefinition,
});
