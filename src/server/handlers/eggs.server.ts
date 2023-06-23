import Object from "@rbxts/object-utils";
import { HttpService, Players, ReplicatedStorage } from "@rbxts/services";
import { addPetToCache } from "server/modules/datastore/petExistStore";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
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

const hatchSystemMessage = remotes.Server.GetNamespace("eggs").Get("hatchEggSystemMessage");
const hatchEgg = remotes.Server.GetNamespace("eggs").Get("hatchEgg");
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

		// calculate luck
		const petChances = Object.entries(eggData.pets).map(([, petData]) => {
			const newPetData = { ...petData };

			if (petData.rarity === "Legendary" || petData.rarity === "Prismatic" || petData.rarity === "Primordial") {
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

			// check if it should be saved to the memory store service (rarity of `Primordial` or higher)
			if (pet.rarity === "Prismatic" || pet.rarity === "Primordial") {
				addPetToCache(pet.id);
				hatchSystemMessage.SendToAllPlayers(player, pet.id, isVoid ? "void" : "regular", "hatched");
			} else if (pet.rarity === "Legendary") {
				hatchSystemMessage.SendToAllPlayers(player, pet.id, isVoid ? "void" : "regular", "hatched");
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
