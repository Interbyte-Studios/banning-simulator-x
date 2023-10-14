import Object from "@rbxts/object-utils";
import { HttpService, MarketplaceService, Players } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { savePlayerData } from "server/modules/datastore/savePlayerData";
import { hatchGameEgg } from "server/modules/pets/hatchEgg";
import { retrieveStore } from "server/playerStore";
import {
	BOOST_PRODUCTS,
	CURRENCY_PURCHASES,
	EXCLUSIVE_PETS,
	GAMEPASS_GIFTS,
	GAMEPASSES,
	LIMITED_EGG,
	LIMITED_EGG_DEVPRODUCT,
	ONE_HUNDRED_SPINS,
	PET_QUEST_DEVPRODUCT,
	PET_QUEST_PET_ID,
	PURCHASE_PET_TEAM_PRODUCT,
	TEN_SPINS,
} from "shared/configs/game";
import { WORLDS } from "shared/configs/worlds";
import { zones } from "shared/configs/zones";
import { remotes } from "shared/remotes";
import { storeBoost } from "shared/rodux/boosts";
import { awardCurrency } from "shared/rodux/currencies";
import { claimDevProduct } from "shared/rodux/devProducts";
import { hatchEgg } from "shared/rodux/eggs";
import { claimGamepass } from "shared/rodux/gamepasses";
import { claimGamepassGift } from "shared/rodux/gamepassGifts";
import { addPets, HatchedPet } from "shared/rodux/pets";
import { purchasePetTeam } from "shared/rodux/petTeams";
import { addPurchasedSpins } from "shared/rodux/spinWheel";

const eggsNamespace = remotes.Server.GetNamespace("eggs");
const conveyHatch = eggsNamespace.Get("conveyHatch");

MarketplaceService.PromptGamePassPurchaseFinished.Connect((player, id, purchased) => {
	debug.setmemorycategory("MarketplacePromptGamePassPurchaseFinished");
	if (!purchased) return;

	const store = retrieveStore(player);
	for (const [gamepassName, gamepassId] of pairs(GAMEPASSES)) {
		if (gamepassId === id) {
			store.dispatch(claimGamepass(gamepassName));
			break;
		}
	}
});

// eslint-disable-next-line jsdoc/require-jsdoc
MarketplaceService.ProcessReceipt = (receiptInfo): Enum.ProductPurchaseDecision => {
	debug.setmemorycategory("ProcessReceipt");
	const player = Players.GetPlayers().find((player) => player.UserId === receiptInfo.PlayerId);
	if (player === undefined) {
		warn(
			`Player with id: "${receiptInfo.PlayerId}" failed to purchase dev product with an id of: "${receiptInfo.ProductId}" because the player did not exist.`,
		);
		return Enum.ProductPurchaseDecision.NotProcessedYet;
	}

	const store = retrieveStore(player);
	const currentState = store.getState();
	const alreadyReceivedRewards = currentState.devProducts.find(
		(purchaseLog) => purchaseLog.purchaseId === receiptInfo.PurchaseId,
	);
	if (alreadyReceivedRewards !== undefined) {
		return Enum.ProductPurchaseDecision.NotProcessedYet;
	}

	let purchaseProcessed = false;
	Object.entries(CURRENCY_PURCHASES).forEach(([purchasableCurrency, purchaseData]) =>
		Object.entries(purchaseData).forEach(([, optionData]) => {
			if (optionData.devId === receiptInfo.ProductId) {
				let highestIndex = 0;
				let highestReward = 0;
				for (const [worldName, worldData] of pairs(WORLDS)) {
					const storedWorld = currentState.worlds.find((world) => world.name === worldName);
					if (storedWorld === undefined) {
						continue;
					}

					if (purchasableCurrency === "gems" && worldData.id > highestIndex) {
						highestIndex = worldData.id;
						highestReward = highestIndex * 3000;
					}

					if (worldData.reward !== purchasableCurrency) {
						continue;
					}

					for (const [zoneName, zoneData] of pairs(zones)) {
						if (zoneData.worldParent !== worldName) {
							continue;
						}

						const storedZone = storedWorld.zones.find((zone) => zone === zoneName);
						if (storedZone === undefined) {
							continue;
						}

						if (zoneData.id > highestIndex) {
							highestIndex = zoneData.id;
							highestReward = zoneData.npcs.filter((npc) => npc.isBoss)[0].reward.currency;
						}
					}
				}
				store.dispatch(awardCurrency(purchasableCurrency, highestReward * optionData.highestZoneMultiplier));
				purchaseProcessed = true;
			}
		}),
	);

	if (receiptInfo.ProductId === TEN_SPINS) {
		store.dispatch(addPurchasedSpins(1));
		purchaseProcessed = true;
	}

	if (receiptInfo.ProductId === ONE_HUNDRED_SPINS) {
		store.dispatch(addPurchasedSpins(10));
		purchaseProcessed = true;
	}

	for (const [boostName, boostTimes] of pairs(BOOST_PRODUCTS)) {
		for (const [boostTime, boostId] of pairs(boostTimes)) {
			if (boostId === receiptInfo.ProductId) {
				store.dispatch(storeBoost(boostName, boostTime));
				purchaseProcessed = true;
			}
		}
	}

	for (const [gamepassName, gamepassBoostId] of pairs(GAMEPASS_GIFTS)) {
		if (gamepassBoostId === receiptInfo.ProductId) {
			store.dispatch(claimGamepassGift(gamepassName));
			purchaseProcessed = true;
		}
	}

	if (receiptInfo.ProductId === PURCHASE_PET_TEAM_PRODUCT) {
		if (currentState.petTeams.maxTeams >= 10) {
			return Enum.ProductPurchaseDecision.NotProcessedYet;
		}

		store.dispatch(purchasePetTeam());
		purchaseProcessed = true;
	}

	if (receiptInfo.ProductId === LIMITED_EGG_DEVPRODUCT.OneEgg) {
		const hatchedPet = hatchGameEgg(currentState, LIMITED_EGG, "regular");

		// log pet
		const storedPet: HatchedPet = {
			...hatchedPet.pet,
			autoDeleted: currentState.settings.autoDelete.includes(hatchedPet.pet.id),
			magicPet: hatchedPet.isMagic,
		};
		store.dispatch(hatchEgg(0, "coins", [storedPet]));

		conveyHatch.SendToPlayer(player, LIMITED_EGG, [storedPet], false);
		purchaseProcessed = true;
	}

	if (receiptInfo.ProductId === LIMITED_EGG_DEVPRODUCT.ThreeEggs) {
		const hatchedEggs: Array<HatchedPet> = [];
		for (let i = 0; i < 3; i++) {
			// invoke a hatched egg
			const hatchedPet = hatchGameEgg(currentState, LIMITED_EGG, "regular");

			// log pet
			const storedPet: HatchedPet = {
				...hatchedPet.pet,
				autoDeleted: currentState.settings.autoDelete.includes(hatchedPet.pet.id),
				magicPet: hatchedPet.isMagic,
			};
			hatchedEggs.push(storedPet);
		}

		store.dispatch(hatchEgg(0, "coins", hatchedEggs));

		conveyHatch.SendToPlayer(player, LIMITED_EGG, hatchedEggs, false);
		purchaseProcessed = true;
	}

	for (const exclusivePet of EXCLUSIVE_PETS) {
		if (receiptInfo.ProductId === exclusivePet.devproductId) {
			store.dispatch(
				addPets([
					{
						id: exclusivePet.petId,
						variant: "regular",
						tradeLocked: false,
						guid: HttpService.GenerateGUID(false),
					},
				]),
			);

			modifyPetCount({
				type: "addPet",
				petId: exclusivePet.petId,
				variant: "regular",
			});
			purchaseProcessed = true;
		}
	}

	if (receiptInfo.ProductId === PET_QUEST_DEVPRODUCT) {
		store.dispatch(
			addPets([
				{
					id: PET_QUEST_PET_ID,
					variant: "regular",
					tradeLocked: false,
					guid: HttpService.GenerateGUID(false),
				},
			]),
		);

		modifyPetCount({
			type: "addPet",
			petId: PET_QUEST_PET_ID,
			variant: "regular",
		});
		purchaseProcessed = true;
	}

	if (!purchaseProcessed) throw `Product of id ${receiptInfo.ProductId} was not processed.`;

	store.dispatch(claimDevProduct(receiptInfo.ProductId, receiptInfo.PurchaseId));
	const successfullySaved = savePlayerData(player).await();
	if (!(successfullySaved[0] && successfullySaved[1])) {
		warn(`Failed to save player data after purchasing dev product with an id of: "${receiptInfo.ProductId}".`);
		return Enum.ProductPurchaseDecision.NotProcessedYet;
	}

	return Enum.ProductPurchaseDecision.PurchaseGranted;
};
