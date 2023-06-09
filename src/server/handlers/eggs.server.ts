import { HttpService, Players, ReplicatedStorage } from "@rbxts/services";
import { addPetToCache } from "server/modules/datastoreCaches/petExistStore";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { getPetPercentages } from "server/util/getPetPercentages";
import { hatchDebounce } from "shared/configs/eggs";
import { Rarities } from "shared/configs/rarities";
import { remotes } from "shared/remotes";
import { addEgg } from "shared/rodux/eggs";
import { addPets, ConfirmedPet } from "shared/rodux/pets";
import { isImmuneRarity } from "shared/rodux/settings";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { getPetInventorySize } from "shared/util/getPetInventorySize";
import { withinDistanceToHatch } from "shared/util/withinDistanceToHatch";

import { getTradeStatus } from "./trading/trades";

const hatchEgg = remotes.Server.GetNamespace("eggs").Create("hatchEgg");
const hatchTimeCache: Map<Player, number> = new Map();
const randomGenerator = new Random();

hatchEgg.SetCallback(
	withPlayerStore((player, store, amount, eggName, isVoid) => {
		// verify that player has waited long enough to hatch
		const lastHatchTime = hatchTimeCache.get(player) ?? 0;

		const now = time();
		const canHatch = now - lastHatchTime > hatchDebounce;
		if (!canHatch) {
			return {
				success: false,
			};
		}

		const isTrading = getTradeStatus(player) !== undefined;
		if (isTrading) {
			return {
				success: false,
			};
		}

		// verify that the user can hatch the eggs
		const currentState = store.getState();
		const eggData = getEggData(eggName);

		// find reduced egg cost provided by player mastery
		const eggMasteryReducedMultiplier = getEggsMastery(store.getState().eggs).reducedEggCostMultiplier;
		const eggCost = getEggCost(eggName, isVoid, eggMasteryReducedMultiplier);

		// check that user owns world
		const ownsWorld = currentState.worlds.find((x) => x.name === eggData.world);
		if (ownsWorld === undefined) {
			return {
				success: false,
			};
		}

		// check that user owns zone
		const ownsZone = ownsWorld.zones.find((x) => x === eggData.zone);
		if (ownsZone === undefined) {
			return {
				success: false,
			};
		}

		// check cost
		if (currentState.currencies[eggCost.currencyType] < eggCost.amount * amount) {
			return {
				success: false,
			};
		}

		// check inventory space
		if (currentState.pets.size() + amount > getPetInventorySize(currentState.gamepasses)) {
			return {
				success: false,
			};
		}

		// check that user is within distance
		const character = player.Character;
		if (character === undefined) {
			return {
				success: false,
			};
		}

		const isWithinDistance = withinDistanceToHatch(character, eggName, isVoid);
		if (!isWithinDistance) {
			return {
				success: false,
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
		const truePetPercentages = getPetPercentages(eggName, boostEnabled, ownsLuckGamepass);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const _ of $range(1, amount)) {
			const randomNumber = randomGenerator.NextNumber(0, 100);
			truePetPercentages.forEach((registeredPet) => {
				if (registeredPet.isLowestId) {
					if (randomNumber < registeredPet.petChance) {
						hatchedPets.push({ id: registeredPet.petId, rarity: registeredPet.rarity });
						return;
					}
				}

				if (randomNumber > registeredPet.petChance) {
					const nextPet = truePetPercentages.find((x) => x.petId === registeredPet.petId + 1);
					if (nextPet === undefined) {
						hatchedPets.push({ id: registeredPet.petId, rarity: registeredPet.rarity });
						return;
					}

					if (randomNumber < nextPet.petChance) {
						hatchedPets.push({ id: registeredPet.petId, rarity: registeredPet.rarity });
						return;
					}
				}
			});
		}

		// confirm pet
		const selectedPets: Array<ConfirmedPet> = [];
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
				autoDeleted = currentState.settings.autoDelete.rarities[pet.rarity];
			}

			// check to see if we should add an enhancement by default to the pet (random chance)
			/*
			let selectedEnhancement: EnhancePetMetadata | undefined;

			const randomNumber = new Random().NextInteger(0, 100);
			if (randomNumber > 99) {
				const rolledEnhancement = rollEnhancement(isVoid ? "void" : "regular");
				if (rolledEnhancement === undefined) {
					warn(`Failed to roll a "${isVoid ? "void" : "regular"}" enhancement upon hatching pet with id: "${pet.id}"`);
				} else {
					selectedEnhancement = {
						category: rolledEnhancement.category,
						rarity: rolledEnhancement.rarity,
						variant: isVoid ? "void" : "regular",
					};
				}
			}
			*/

			// check if it should be saved to the memory store service (rarity of `Primordial` or higher)
			if (pet.rarity === "Prismatic" || pet.rarity === "Primordial") {
				addPetToCache(pet.id);
			}

			selectedPets.push({
				autoDeleted,
				id: pet.id,
				guid: HttpService.GenerateGUID(false),
				variant: isVoid ? "void" : "regular",
				method: "hatch",
				//enhancements: { [pet.rarity]: selectedEnhancement },
				tradeLocked: false,
			});
		}

		if (selectedPets.size() !== amount) {
			throw `Issue on the server confirming how many pets should be hatched. Player: ${
				player.Name
			} | Amount: ${amount} | Egg: ${eggName} | Void: ${isVoid} | Amount that server hatched: ${selectedPets.size()}}`;
		}

		store.dispatch(addPets(eggCost.amount * selectedPets.size(), eggCost.currencyType, selectedPets));
		store.dispatch(addEgg(selectedPets));
		return {
			success: true,
			pets: selectedPets,
		};
	}),
);

Players.PlayerRemoving.Connect((player) => {
	hatchTimeCache.delete(player);
});
