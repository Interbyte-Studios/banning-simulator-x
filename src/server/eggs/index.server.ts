import { Players } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import { getPetPercentages } from "server/util/getPetPercentages";
import { hatchDebounce } from "shared/configs/eggs";
import { remotes } from "shared/remotes";

export const requestHatch = remotes.Server.GetNamespace("eggs").Create("requestHatch");
export const relayHatch = remotes.Server.GetNamespace("eggs").Create("relayHatch");

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	const randomGenerator = new Random();

	let lastHatchTime = 0;
	requestHatch.Connect((player, amount, eggName, isVoid) => {
		const now = time();
		if (now - lastHatchTime < hatchDebounce) return;
		lastHatchTime = now;

		// todo: check that user owns world egg comes from
		// check that user owns world

		// todo: check that user owns the zone the egg comes from
		// check that user owns zone

		// todo: check that user has enough currency
		// check for currency

		// todo: check that user has enough space to hatch the eggs
		// check inventory space

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

		if (hatchedPets.size() === amount) {
			// todo: register pet to rodux
			// register pet to rodux

			// todo: check if it should be auto-deleted
			// check if it should be auto-deleted

			// todo: check if it should be saved to the memory store service (rarity of `Primordial` or higher)
			// check if it should be saved to the memory store service (rarity of `Primordial` or higher)

			relayHatch.SendToPlayer(player, amount, eggName, hatchedPets, isVoid);
		} else {
			throw `Did not get the correct amount of pets when hatching. ${hatchedPets.size()} | ${amount}`;
		}
	});
});
