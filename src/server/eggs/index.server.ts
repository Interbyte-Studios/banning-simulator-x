import { Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { purchaseEgg } from "server/modules/rodux/purchaseEgg";
import { getPetPercentages } from "server/util/getPetPercentages";
import { hatchDebounce } from "shared/configs/eggs";
import { remotes } from "shared/remotes";
import { ConfirmedPet } from "shared/remotes/eggs/hatchEgg";
import { addPets } from "shared/rodux/pets";
import { toggleAuto } from "shared/rodux/settings";

export const hatchEgg = remotes.Server.GetNamespace("eggs").Create("hatchEgg");
export const toggleHatch = remotes.Server.GetNamespace("eggs").Create("toggleAuto");

const hatchTimeCache: Map<Player, number> = new Map();

const randomGenerator = new Random();

hatchEgg.SetCallback(
	withPlayerStore((player, store, amount, eggName, isVoid) => {
		// verify that player has waited long enough to hatch
		const lastHatchTime = hatchTimeCache.get(player) ?? 0;

		const now = time();
		const canHatch = now - lastHatchTime > hatchDebounce;
		if (!canHatch) {
			return;
		}

		hatchTimeCache.set(player, now);

		// randomly hatch eggs
		const hatchedPets: Array<number> = [];
		const truePetPercentages = getPetPercentages(eggName);

		for (let i = 1; i <= amount; i++) {
			const randomNumber = randomGenerator.NextNumber(0, 100);

			for (const registeredPet of truePetPercentages) {
				if (registeredPet.isLowestId) {
					if (randomNumber < registeredPet.petChance) {
						hatchedPets.push(registeredPet.petId);
						break;
					}
				}

				if (randomNumber > registeredPet.petChance) {
					const nextPet = truePetPercentages.find((x) => x.petId === registeredPet.petId + 1);
					if (nextPet === undefined) {
						hatchedPets.push(registeredPet.petId);
						break;
					}

					if (randomNumber < nextPet.petChance) {
						hatchedPets.push(registeredPet.petId);
						break;
					}
				}
			}
		}

		// confirm pet
		const selectedPets: Array<ConfirmedPet> = [];
		for (const pet of hatchedPets) {
			const purchasePet = purchaseEgg(store, eggName, pet, isVoid);
			if (purchasePet.success) {
				// todo: check if it should be saved to the memory store service (rarity of `Primordial` or higher)
				// check if it should be saved to the memory store service (rarity of `Primordial` or higher)

				selectedPets.push({
					id: pet,
					variant: isVoid ? "void" : "regular",
					autoDeleted: purchasePet.wasAutoDeleted,
				});
			}
		}

		if (selectedPets.size() <= 0 || selectedPets.size() > 3) {
			throw `Issue on the server confirming how many pets should be hatched. Player: ${player.Name} | Amount: ${amount} | Egg: ${eggName} | Void: ${isVoid}`;
		}

		store.dispatch(addPets(selectedPets));
		relayHatch.SendToPlayer(player, selectedPets.size() as 1 | 2 | 3, eggName, selectedPets, isVoid);
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
	const lastHatchData = hatchTimeCache.get(player);
	if (lastHatchData !== undefined) {
		hatchTimeCache.delete(player);
	}
});
