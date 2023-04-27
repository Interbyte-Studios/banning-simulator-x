import { DataStoreService, MarketplaceService, Players } from "@rbxts/services";
import { retrieveStore } from "server/playerStore";
import { BOOST_PRODUCTS, PURCHASE_PET_TEAM_PRODUCT } from "shared/configs/game";
import { claimBoost } from "shared/rodux/boosts";
import { claimDevProduct } from "shared/rodux/devProducts";
import { purchasePetTeam } from "shared/rodux/petTeams";
import { getBoostMastery } from "shared/util/getBoostMastery";

const marketplaceDataStore = DataStoreService.GetDataStore("marketplacePurchases");

// eslint-disable-next-line jsdoc/require-jsdoc
MarketplaceService.ProcessReceipt = (receiptInfo): Enum.ProductPurchaseDecision => {
	// check to see if we have already purchased this
	const [hasBeenPurchased] = pcall(() => marketplaceDataStore.GetAsync(receiptInfo.PurchaseId));
	if (hasBeenPurchased) {
		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}

	const player = Players.GetPlayers().find((player) => player.UserId === receiptInfo.PlayerId);
	if (player === undefined) {
		warn(
			`Player with id: "${receiptInfo.PlayerId}" failed to purchase dev product with an id of: "${receiptInfo.ProductId}" because the player did not exist.`,
		);
		return Enum.ProductPurchaseDecision.NotProcessedYet;
	}

	const store = retrieveStore(player);
	const boostMasteryExtendedDuration = getBoostMastery(store.getState().boosts).extendedDurationMultiplier;

	let purchaseProcessed = false;
	for (const [boostName, boostTimes] of pairs(BOOST_PRODUCTS)) {
		for (const [, boostId] of pairs(boostTimes)) {
			if (boostId === receiptInfo.ProductId) {
				store.dispatch(claimBoost(boostName, 15, boostMasteryExtendedDuration));
				purchaseProcessed = true;
			}
		}
	}

	if (receiptInfo.ProductId === PURCHASE_PET_TEAM_PRODUCT) {
		if (store.getState().petTeams.maxTeams >= 10) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		store.dispatch(purchasePetTeam());
		purchaseProcessed = true;
	}

	if (!purchaseProcessed) throw `Product of id ${receiptInfo.ProductId} was not processed.`;

	const [savedMarketplacePurchase] = pcall(() => marketplaceDataStore.SetAsync(receiptInfo.PurchaseId, true));
	if (!savedMarketplacePurchase) {
		throw `Unable to update DataStores for ProcessReceipt - ${receiptInfo.PurchaseId}`;
	} else {
		// update player store
		store.dispatch(claimDevProduct(receiptInfo.ProductId, receiptInfo.PurchaseId));
		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}
};
