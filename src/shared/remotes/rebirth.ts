import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { Currency, isCurrency } from "shared/configs/currencies";

export const rebirthPurchaseDefinition = Net.Definitions.ClientToServerEvent<[]>();
export type RebirthPurchaseDefinition = typeof rebirthPurchaseDefinition;

export const purchaseMagicEggsDefinition = Net.Definitions.ClientToServerEvent<[]>();
export type PurchaseMagicEggsDefinition = typeof purchaseMagicEggsDefinition;

export const purchaseAdditionalEggsDefinition = Net.Definitions.ClientToServerEvent<[]>();
export type PurchaseAdditionalEggsDefinition = typeof purchaseAdditionalEggsDefinition;

export const purchaseAdditionalPetsDefinition = Net.Definitions.ClientToServerEvent<[]>();
export type PurchaseAdditionalPetsDefinition = typeof purchaseAdditionalPetsDefinition;

export const purchaseCurrencyUpgradeDefinition = Net.Definitions.ClientToServerEvent<[currency: Currency]>([
	createTypeChecker(isCurrency),
]);
export type PurchaseCurrencyUpgradeDefinition = typeof purchaseCurrencyUpgradeDefinition;

export const purchaseTeleportUpgradeDefinition = Net.Definitions.ClientToServerEvent<[]>();
export type PurchaseTeleportUpgradeDefinition = typeof purchaseTeleportUpgradeDefinition;

export const purchaseFastHatchUpgradeDefinition = Net.Definitions.ClientToServerEvent<[]>();
export type PurchaseFastHatchUpgradeDefinition = typeof purchaseFastHatchUpgradeDefinition;

export const purchaseExtraLuckUpgradeDefinition = Net.Definitions.ClientToServerEvent<[]>();
export type PurchaseExtraLuckUpgradeDefinition = typeof purchaseExtraLuckUpgradeDefinition;

export const rebirthsNamespace = Net.Definitions.Namespace({
	rebirth: rebirthPurchaseDefinition,
	purchaseMagicEggs: purchaseMagicEggsDefinition,
	purchaseAdditionalEggs: purchaseAdditionalEggsDefinition,
	purchaseAdditionalPets: purchaseAdditionalPetsDefinition,
	purchaseCurrency: purchaseCurrencyUpgradeDefinition,
	purchaseTeleport: purchaseTeleportUpgradeDefinition,
	purchaseFastHatch: purchaseFastHatchUpgradeDefinition,
	purchaseExtraLuck: purchaseExtraLuckUpgradeDefinition,
});
