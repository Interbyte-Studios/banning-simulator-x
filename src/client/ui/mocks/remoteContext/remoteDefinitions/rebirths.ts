import {
	PurchaseAdditionalEggsDefinition,
	PurchaseAdditionalPetsDefinition,
	PurchaseCurrencyUpgradeDefinition,
	PurchaseExtraLuckUpgradeDefinition,
	PurchaseFastHatchUpgradeDefinition,
	PurchaseMagicEggsDefinition,
	PurchaseTeleportUpgradeDefinition,
	RebirthPurchaseDefinition,
} from "shared/remotes/rebirth";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the rebirths remote functions.
 */
export const rebirthsRemoteContext = {
	rebirth: fakeRemoteCall<RebirthPurchaseDefinition>("rebirth"),
	purchaseMagicEggs: fakeRemoteCall<PurchaseMagicEggsDefinition>("purchaseMagicEggs"),
	purchaseAdditionalEggs: fakeRemoteCall<PurchaseAdditionalEggsDefinition>("purchaseAdditionalEggs"),
	purchaseAdditionalPets: fakeRemoteCall<PurchaseAdditionalPetsDefinition>("purchaseAdditionalPets"),
	purchaseCurrencyUpgrade: fakeRemoteCall<PurchaseCurrencyUpgradeDefinition>("purchaseCurrencyUpgrade"),
	purchaseTeleport: fakeRemoteCall<PurchaseTeleportUpgradeDefinition>("purchaseTeleportUpgrade"),
	purchaseFastHatch: fakeRemoteCall<PurchaseFastHatchUpgradeDefinition>("purchaseFastHatch"),
	purchaseExtraLuck: fakeRemoteCall<PurchaseExtraLuckUpgradeDefinition>("purchaseExtraLuck"),
};
