import { Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { getPetPercentages } from "server/util/getPetPercentages";
import { hatchDebounce } from "shared/configs/eggs";
import { Rarities } from "shared/configs/rarities";
import { remotes } from "shared/remotes";
import { ConfirmedPet } from "shared/remotes/eggs/hatchEgg";
import { addPets } from "shared/rodux/pets";
import { toggleAuto } from "shared/rodux/settings";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getPetInventorySize } from "shared/util/getPetInventorySize";

const hatchEgg = remotes.Server.GetNamespace("eggs").Create("hatchEgg");
const toggleHatch = remotes.Server.GetNamespace("eggs").Create("toggleAuto");

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

		// verify that the user can hatch the eggs
		const currentState = store.getState();
		const eggData = getEggData(eggName);
		const eggCost = getEggCost(eggName, isVoid);

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

		// begin hatching
		hatchTimeCache.set(player, now);

		// randomly hatch eggs
		const hatchedPets: Array<{
			id: number;
			rarity: Rarities;
		}> = [];

		const truePetPercentages = getPetPercentages(eggName);

		for (let i = 1; i <= amount; i++) {
			const randomNumber = randomGenerator.NextNumber(0, 100);

			for (const registeredPet of truePetPercentages) {
				if (registeredPet.isLowestId) {
					if (randomNumber < registeredPet.petChance) {
						hatchedPets.push({ id: registeredPet.petId, rarity: registeredPet.rarity });
						break;
					}
				}

				if (randomNumber > registeredPet.petChance) {
					const nextPet = truePetPercentages.find((x) => x.petId === registeredPet.petId + 1);
					if (nextPet === undefined) {
						hatchedPets.push({ id: registeredPet.petId, rarity: registeredPet.rarity });
						break;
					}

					if (randomNumber < nextPet.petChance) {
						hatchedPets.push({ id: registeredPet.petId, rarity: registeredPet.rarity });
						break;
					}
				}
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

			// todo: check if it should be auto deleted
			// check if it should be auto deleted

			// todo: check if it should be saved to the memory store service (rarity of `Primordial` or higher)
			// check if it should be saved to the memory store service (rarity of `Primordial` or higher)

			selectedPets.push({
				autoDeleted: false,
				id: pet.id,
				rarity: pet.rarity,
				variant: isVoid ? "void" : "regular",
			});
		}

		if (selectedPets.size() <= 0 || selectedPets.size() > 3) {
			throw `Issue on the server confirming how many pets should be hatched. Player: ${player.Name} | Amount: ${amount} | Egg: ${eggName} | Void: ${isVoid}`;
		}

		store.dispatch(addPets(eggCost.amount * selectedPets.size(), eggCost.currencyType, selectedPets));
		return {
			success: true,
			pets: selectedPets,
		};
	}),
);

let lastRequestTime = 0;
toggleHatch.Connect(
	withPlayerStore((_, store) => {
		const now = time();
		if (now - lastRequestTime < 0.5) return;
		lastRequestTime = now;

		store.dispatch(toggleAuto());
	}),
);

Players.PlayerRemoving.Connect((player) => {
	hatchTimeCache.delete(player);
});
