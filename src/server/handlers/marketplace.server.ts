import { DataStoreService, HttpService, MarketplaceService, Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { retrieveStore } from "server/playerStore";
import {
	BOOST_PRODUCTS,
	EXCLUSIVE_PETS,
	LIMITED_EGG,
	LIMITED_EGG_DEVPRODUCT,
	PURCHASE_PET_TEAM_PRODUCT,
} from "shared/configs/game";
import { remotes } from "shared/remotes";
import { storeBoost } from "shared/rodux/boosts";
import { claimDevProduct } from "shared/rodux/devProducts";
import { addPets } from "shared/rodux/pets";
import { purchasePetTeam } from "shared/rodux/petTeams";
import { getEggData } from "shared/util/getEggData";

const marketplaceDataStore = DataStoreService.GetDataStore("marketplacePurchases", "testPurchases");
const validPlayerPurchaseLog = t.array(
	t.strictInterface({
		productId: t.number,
		purchaseId: t.string,
	}),
);
type ValidPlayerPurchaseLog = t.static<typeof validPlayerPurchaseLog>;

const marketplaceRemotes = remotes.Server.GetNamespace("eggs");
const hatchSingleExclusive = marketplaceRemotes.Get("hatchSingleExclusiveEgg");
const tripleSingleExclusive = marketplaceRemotes.Get("hatchTripleExclusiveEgg");

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

	if (receiptInfo.ProductId === LIMITED_EGG_DEVPRODUCT.OneEgg) {
		const randomObject = new Random();

		let selectedPet = 0;
		let chance = randomObject.NextNumber(0, 100);
		const eggData = getEggData(LIMITED_EGG);
		for (const [, petData] of pairs(eggData.pets)) {
			chance -= petData.chance;
			if (chance > 0) {
				continue;
			}

			selectedPet = petData.id;
			break;
		}

		store.dispatch(
			addPets(0, "coins", [
				{
					id: selectedPet,
					variant: "regular",
					method: "purchase",
					tradeLocked: false,
					autoDeleted: false,
					guid: HttpService.GenerateGUID(false),
				},
			]),
		);

		hatchSingleExclusive.SendToPlayer(player, LIMITED_EGG, selectedPet);
		return Enum.ProductPurchaseDecision.PurchaseGranted;
	}

	if (receiptInfo.ProductId === LIMITED_EGG_DEVPRODUCT.ThreeEggs) {
		const selectedPets: Array<number> = [];

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const _ of $range(1, 3)) {
			const randomObject = new Random();

			const eggData = getEggData(LIMITED_EGG);
			let chance = randomObject.NextNumber(0, 100);
			for (const [, petData] of pairs(eggData.pets)) {
				chance -= petData.chance;
				if (chance > 0) {
					continue;
				}

				selectedPets.push(petData.id);
				break;
			}
		}

		store.dispatch(
			addPets(
				0,
				"coins",
				selectedPets.map((petId) => {
					return {
						id: petId,
						variant: "regular",
						method: "purchase",
						tradeLocked: false,
						autoDeleted: false,
						guid: HttpService.GenerateGUID(false),
					};
				}),
			),
		);

		tripleSingleExclusive.SendToPlayer(player, LIMITED_EGG, selectedPets);
		return Enum.ProductPurchaseDecision.PurchaseGranted;
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
