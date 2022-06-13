import { Players } from "@rbxts/services";
import { purchaseEgg } from "server/modules/rodux/purchaseEgg";
import { onStoreCreated } from "server/playerStore";
import { getPetPercentages } from "server/util/getPetPercentages";
import { hatchDebounce } from "shared/configs/eggs";
import { remotes } from "shared/remotes";
import { ConfirmedPet } from "shared/remotes/eggs/relayHatchInfo";
import { toggleAuto } from "shared/rodux/settings";

export const requestHatch = remotes.Server.GetNamespace("eggs").Create("requestHatch");
export const relayHatch = remotes.Server.GetNamespace("eggs").Create("relayHatch");
export const toggleHatch = remotes.Server.GetNamespace("eggs").Create("toggleAuto");

const randomGenerator = new Random();

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	let lastHatchTime = 0;
	requestHatch.Connect((player, amount, eggName, isVoid) => {
		const now = time();
		if (now - lastHatchTime < hatchDebounce) return;
		lastHatchTime = now;

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
		const confirmedPets: Array<ConfirmedPet> = [];
		for (const pet of hatchedPets) {
			const purchasePet = purchaseEgg(store, eggName, pet, isVoid);
			if (purchasePet) {
				// todo: check if it should be saved to the memory store service (rarity of `Primordial` or higher)
				// check if it should be saved to the memory store service (rarity of `Primordial` or higher)

				confirmedPets.push({
					id: pet,
					autoDeleted: purchasePet.wasAutoDeleted,
				});
			}
		}

		if (confirmedPets.size() <= 0 || confirmedPets.size() > 3) {
			warn(
				`Issue on the server confirming how many pets should be hatched. Player: ${player.Name} | Amount: ${amount} | Egg: ${eggName} | Void: ${isVoid}`,
			);
			return;
		}

		relayHatch.SendToPlayer(player, confirmedPets.size() as 1 | 2 | 3, eggName, confirmedPets, isVoid);
	});

	let lastRequestTime = 0;
	toggleHatch.Connect(() => {
		const now = time();
		if (now - lastRequestTime < 0.5) return;
		lastRequestTime = now;

		store.dispatch(toggleAuto());
	});
});
