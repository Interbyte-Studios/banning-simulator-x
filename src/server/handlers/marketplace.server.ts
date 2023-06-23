import { DataStoreService, HttpService, MarketplaceService, Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { retrieveStore } from "server/playerStore";
import { BOOST_PRODUCTS, EXCLUSIVE_PETS, PURCHASE_PET_TEAM_PRODUCT } from "shared/configs/game";
import { storeBoost } from "shared/rodux/boosts";
import { claimDevProduct } from "shared/rodux/devProducts";
import { addPets } from "shared/rodux/pets";
import { purchasePetTeam } from "shared/rodux/petTeams";

const validPlayerPurchaseLog = t.array(
	t.strictInterface({
		productId: t.number,
		purchaseId: t.string,
	}),
);
type ValidPlayerPurchaseLog = t.static<typeof validPlayerPurchaseLog>;

const marketplaceDataStore = DataStoreService.GetDataStore("marketplacePurchases", "testPurchases");

// eslint-disable-next-line jsdoc/require-jsdoc
MarketplaceService.ProcessReceipt = (receiptInfo): Enum.ProductPurchaseDecision => {
	// check to see if we have already purchased this
	const [success, playerPurchaseData] = pcall(() => marketplaceDataStore.GetAsync(tostring(receiptInfo.PlayerId)));
	if (!success) {
		warn(
			`Failed to get player's purchase history. Even with no purchase history, this shouldn't happen! Datastores might be inaccessible at the moment!`,
		);
		return Enum.ProductPurchaseDecision.NotProcessedYet;
	}

	let newPlayerPurchaseData: ValidPlayerPurchaseLog = [];
	if (playerPurchaseData !== undefined && validPlayerPurchaseLog(playerPurchaseData)) {
		newPlayerPurchaseData = playerPurchaseData;
	}

	const alreadyReceivedRewards = newPlayerPurchaseData.find(
		(purchaseLog) => purchaseLog.purchaseId === receiptInfo.PurchaseId,
	);
	if (alreadyReceivedRewards !== undefined) {
		return Enum.ProductPurchaseDecision.NotProcessedYet;
	}

	const player = Players.GetPlayers().find((player) => player.UserId === receiptInfo.PlayerId);
	if (player === undefined) {
		warn(
			`Player with id: "${receiptInfo.PlayerId}" failed to purchase dev product with an id of: "${receiptInfo.ProductId}" because the player did not exist.`,
		);
		return Enum.ProductPurchaseDecision.NotProcessedYet;
	}

	const store = retrieveStore(player);
	let purchaseProcessed = false;
	for (const [boostName, boostTimes] of pairs(BOOST_PRODUCTS)) {
		for (const [boostTime, boostId] of pairs(boostTimes)) {
			if (boostId === receiptInfo.ProductId) {
				store.dispatch(storeBoost(boostName, boostTime));
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

	for (const exclusivePet of EXCLUSIVE_PETS) {
		if (receiptInfo.ProductId === exclusivePet.devproductId) {
			store.dispatch(
				addPets(0, "coins", [
					{
						id: exclusivePet.petId,
						variant: "regular",
						method: "purchase",
						tradeLocked: false,
						autoDeleted: false,
						guid: HttpService.GenerateGUID(false),
					},
				]),
			);
			purchaseProcessed = true;
		}
	}

	if (!purchaseProcessed) throw `Product of id ${receiptInfo.ProductId} was not processed.`;

	const [savedMarketplacePurchase] = pcall(() =>
		marketplaceDataStore.SetAsync(
			tostring(receiptInfo.PlayerId),
			newPlayerPurchaseData.push({
				productId: receiptInfo.ProductId,
				purchaseId: receiptInfo.PurchaseId,
			}),
		),
	);
	if (!savedMarketplacePurchase) {
		throw `Unable to update DataStores for ProcessReceipt - ${receiptInfo.PurchaseId} | Player Id: ${receiptInfo.PlayerId}`;
	} else {
		// update player store
		store.dispatch(claimDevProduct(receiptInfo.ProductId, receiptInfo.PurchaseId));
		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}
};
