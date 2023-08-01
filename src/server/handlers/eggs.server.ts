import Object from "@rbxts/object-utils";
import { HttpService, Players, ReplicatedStorage } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import assetIds from "shared/assets";
import { hatchDebounce } from "shared/configs/eggs";
import { Rarities } from "shared/configs/rarities";
import { WORLD_PRESTIGE } from "shared/configs/worldPrestige";
import { remotes } from "shared/remotes";
import { HatchEggFailKind } from "shared/remotes/eggs/hatchEgg";
import { hatchEgg } from "shared/rodux/eggs";
import { HatchedPet } from "shared/rodux/pets";
import { isImmuneRarity } from "shared/rodux/settings";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { getPetData } from "shared/util/getPetData";
import { getPetInventorySize } from "shared/util/getPetInventorySize";
import { withinDistanceToHatch } from "shared/util/withinDistanceToHatch";

import { getTradeStatus, TradeStatus } from "./trading/trades";

const hatchSystemMessage = remotes.Server.GetNamespace("eggs").Get("hatchEggSystemMessage");
const hatchEggRemote = remotes.Server.GetNamespace("eggs").Get("hatchEgg");
const hatchTimeCache: Map<Player, number> = new Map();
const randomGenerator = new Random();

hatchEggRemote.SetCallback(
	withPlayerStore((player, store, amount, eggName, isVoid) => {
		debug.setmemorycategory("egg");
		// verify that player has waited long enough to hatch
		const lastHatchTime = hatchTimeCache.get(player) ?? 0;

		const now = time();
		const canHatch = now - lastHatchTime > hatchDebounce;
		if (!canHatch) {
			return {
				success: false,
				reason: HatchEggFailKind.TooFast,
			};
		}

		const isTrading =
			getTradeStatus(player) === TradeStatus.Trading ||
			getTradeStatus(player) === TradeStatus.ViewingFinalizedTrade ||
			getTradeStatus(player) === TradeStatus.Finalized;
		if (isTrading) {
			return {
				success: false,
				reason: HatchEggFailKind.Trading,
			};
		}

		// verify that the user can hatch the eggs
		const currentState = store.getState();
		if (amount > 1 && !currentState.gamepasses["Triple Hatch"]) {
			return {
				success: false,
				reason: HatchEggFailKind.NoGamepass,
			};
		}

		// find reduced egg cost provided by player mastery
		const eggData = getEggData(eggName);
		const eggMasteryReducedMultiplier = getEggsMastery(store.getState().eggs).reducedEggCostMultiplier;
		const eggCost = getEggCost(eggName, isVoid, eggMasteryReducedMultiplier);

		// check that user owns world
		const ownsWorld = currentState.worlds.find((x) => x.name === eggData.world);
		if (ownsWorld === undefined) {
			return {
				success: false,
				reason: HatchEggFailKind.NoWorld,
			};
		}

		// check that user owns zone
		const ownsZone = ownsWorld.zones.find((x) => x === eggData.zone);
		if (ownsZone === undefined) {
			return {
				success: false,
				reason: HatchEggFailKind.NoZone,
			};
		}

		// check cost
		if (isVoid && eggData.world !== "Limited" && currentState.worldPrestige[eggData.world] !== undefined) {
			const trueCost =
				eggCost.amount -
				eggCost.amount *
					currentState.worldPrestige[eggData.world].reducedVoidEggCostUpgrades *
					WORLD_PRESTIGE.reducedVoidEggCost.reducedCostMultiplier;

			if (currentState.currencies[eggCost.currencyType] < trueCost * amount) {
				return {
					success: false,
					reason: HatchEggFailKind.NoCurrency,
				};
			}
		} else {
			if (currentState.currencies[eggCost.currencyType] < eggCost.amount * amount) {
				return {
					success: false,
					reason: HatchEggFailKind.NoCurrency,
				};
			}
		}

		// check inventory space
		if (currentState.pets.size() + amount > getPetInventorySize(currentState.gamepasses)) {
			return {
				success: false,
				reason: HatchEggFailKind.NoInventory,
			};
		}

		// check that user is within distance
		const character = player.Character;
		if (character === undefined) {
			return {
				success: false,
				reason: HatchEggFailKind.NoCharacter,
			};
		}

		const isWithinDistance = withinDistanceToHatch(character, eggName, isVoid);
		if (!isWithinDistance) {
			return {
				success: false,
				reason: HatchEggFailKind.NotWithinDistance,
			};
		}

		// begin hatching
		hatchTimeCache.set(player, now);

		// randomly hatch eggs
		const hatchedPets: Array<{
			id: number;
			rarity: Rarities;
		}> = [];

		const boostEnabled = eggData.luckApplies
			? currentState.boosts.active["x2 Hatching Luck"] > 0 || ReplicatedStorage.events.luck.enabled.Value
			: false;
		const ownsLuckGamepass = store.getState().gamepasses["x2 Luck"];

		// calculate luck
		const petChances = Object.entries(eggData.pets).map(([, petData]) => {
			const newPetData = { ...petData };

			if (petData.rarity === "Legendary" || petData.rarity === "Secret" || petData.rarity === "Primordial") {
				if (ownsLuckGamepass) {
					newPetData.chance *= 2;
				}

				if (boostEnabled) {
					newPetData.chance *= 2;
				}
			}

			return newPetData;
		});

		// "normalize" the chances so they add to 100
		const totalChance = Object.values(petChances).reduce((total, pet) => total + pet.chance, 0);
		for (const petData of petChances) {
			petData.chance = (petData.chance / totalChance) * 100;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const _ of $range(1, amount)) {
			let chance = randomGenerator.NextNumber(0, 100);
			for (const petData of petChances) {
				chance -= petData.chance;
				if (chance > 0) {
					continue;
				}

				hatchedPets.push({
					id: petData.id,
					rarity: petData.rarity,
				});
				break;
			}
		}

		// confirm pet
		const selectedPets: Array<HatchedPet> = [];
		for (const pet of hatchedPets) {
			// check for currency
			if (currentState.currencies[eggCost.currencyType] < eggCost.amount) {
				continue;
			}

			// check inventory space
			if (currentState.pets.size() >= getPetInventorySize(currentState.gamepasses) + 1) {
				continue;
			}

			// check if it should be auto deleted
			let autoDeleted = false;
			if (!isImmuneRarity(pet.rarity)) {
				autoDeleted = currentState.settings.autoDelete.includes(pet.id);
			}

			// check if it should be saved to the memory store service (rarity of `Primordial` or higher)
			if (pet.rarity === "Secret" || pet.rarity === "Primordial") {
				hatchSystemMessage.SendToAllPlayers(player, pet.id, isVoid ? "void" : "regular", "hatched");

				const petData = getPetData(pet.id);
				const variantUpperCase = isVoid ? "Void" : "Regular";
				const petVariantName = !isVoid ? petData.name : `${variantUpperCase} ${petData.name}`;

				const image = assetIds.images.decals.pets[petVariantName as keyof typeof assetIds.images.decals.pets];
				let decalToPass = 0;
				if (image !== undefined) {
					// bugged
					decalToPass = image.match("%d+")[0] as number;
					print(decalToPass);
				}

				let existAmount = 0;
				const petExistCache = ReplicatedStorage.PetExistStores.FindFirstChild(pet.id) as Configuration;
				if (petExistCache !== undefined) {
					const variantCache = petExistCache.FindFirstChild(isVoid ? "void" : "regular") as IntValue;
					if (variantCache !== undefined) {
						const variantCache = petExistCache.FindFirstChild(isVoid ? "void" : "regular") as IntValue;
						if (variantCache !== undefined) {
							existAmount += variantCache.Value;
						}
					}
				}

				task.spawn(() => {
					pcall(() => {
						HttpService.RequestAsync({
							Url: "http://137.184.152.180:8765/hatch",
							Body: HttpService.JSONEncode({
								roblox_uid: player.UserId,
								secret_name: petData.name,
								secret_type: pet.rarity,
								pet_variant: isVoid ? "void" : "regular",
								decal: decalToPass,
								exist: existAmount + 1,
							}),
							Method: "POST",
							Headers: {
								"Content-Type": "application/json",
								"X-ACCESS-TOKEN": "V1qijQkozBm1LdD5SsO1",
							},
						});
					});
				});
			} else if (pet.rarity === "Legendary" && !autoDeleted) {
				hatchSystemMessage.SendToAllPlayers(player, pet.id, isVoid ? "void" : "regular", "hatched");
			}

			if (!autoDeleted) {
				modifyPetCount({
					type: "addPet",
					petId: pet.id,
					variant: isVoid ? "void" : "regular",
				});
			}

			selectedPets.push({
				autoDeleted,
				id: pet.id,
				guid: HttpService.GenerateGUID(false),
				variant: isVoid ? "void" : "regular",
				//enhancements: { [pet.rarity]: selectedEnhancement },
				tradeLocked: false,
			});
		}

		if (selectedPets.size() !== amount) {
			throw `Issue on the server confirming how many pets should be hatched. Player: ${
				player.Name
			} | Amount: ${amount} | Egg: ${eggName} | Void: ${isVoid} | Amount that server hatched: ${selectedPets.size()}}`;
		}

		store.dispatch(hatchEgg(eggCost.amount * selectedPets.size(), eggCost.currencyType, selectedPets));
		return {
			success: true,
			pets: selectedPets,
		};
	}),
);

Players.PlayerRemoving.Connect((player) => {
	hatchTimeCache.delete(player);
});
