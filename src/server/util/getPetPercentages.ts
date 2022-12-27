import { ReplicatedStorage } from "@rbxts/services";
import { EggName } from "shared/configs/eggs";
import { Rarities } from "shared/configs/rarities";
import { getEggData } from "shared/util/getEggData";

interface RegisteredPet {
	petId: number;
	petChance: number;
	isLowestId: boolean;
	rarity: Rarities;
}

/**
 * Calculates the true percentages of pets in an egg.
 *
 * @param egg The name of the egg.
 * @param boostEnabled Whether luck boost is enabled or not;.
 * @returns An array of pets with calculated true percentages.
 */
export function getPetPercentages(egg: EggName, boostEnabled: boolean): Array<RegisteredPet> {
	const eggData = getEggData(egg);

	// get the pet with the lowest id in the egg.
	let lowestId = math.huge;
	for (const [, petData] of pairs(eggData.pets)) {
		if (lowestId < petData.id) continue;
		lowestId = petData.id;
	}

	// get the chances of pets by adding the chances of all the pets with lower ids (rarities) to the chance of the pet.
	const registeredPets: Array<RegisteredPet> = [];
	for (const [, petData] of pairs(eggData.pets)) {
		let petChance = petData.chance;
		for (const [, _petData] of pairs(eggData.pets)) {
			if (_petData.id >= petData.id) continue;
			petChance += _petData.chance;
		}

		registeredPets.push({
			petId: petData.id,
			petChance: petChance,
			isLowestId: lowestId === petData.id,
			rarity: petData.rarity,
		});
	}

	// apply luck boost
	const shouldCheckForBoost = boostEnabled || ReplicatedStorage.events.luck.enabled.Value;
	if (shouldCheckForBoost) {
		let boostMultiplier = 0;
		if (boostEnabled) {
			boostMultiplier += 2;
		}
		if (ReplicatedStorage.events.luck.enabled.Value) {
			boostMultiplier += 2;
		}

		if (boostMultiplier < 2) {
			warn("Issue with hatching pets with luck enabled. Boost multiplier was too low.");
		} else {
			const leastRarePet = registeredPets.find((petData) => petData.isLowestId);
			if (leastRarePet === undefined) {
				warn(`Issue with hatching pets with luck enabled. Could not find least rare pet from egg ${egg}.`);
			} else {
				let maxId = 0;
				registeredPets.forEach((petData) => {
					if (petData.petId > maxId) {
						maxId = petData.petId;
					}
				});

				let newLeastRarePetChance = leastRarePet.petChance;
				for (let i = maxId; i >= leastRarePet.petId; i--) {
					const pet = registeredPets.find((petData) => petData.petId === i);
					if (pet) {
						for (const [, petData] of pairs(eggData.pets)) {
							if (petData.id !== pet.petId) {
								continue;
							}

							if (pet.rarity === "Legendary" || pet.rarity === "Prismatic" || pet.rarity === "Primordial") {
								if (pet.petId === maxId) {
									pet.petChance = 100 - petData.chance * boostMultiplier;
									newLeastRarePetChance -= petData.chance * boostMultiplier + petData.chance;
								} else {
									const nextPet = registeredPets.find((petData) => petData.petId === pet.petId + 1);
									if (nextPet !== undefined) {
										pet.petChance = nextPet.petChance - petData.chance * boostMultiplier;
										newLeastRarePetChance -= petData.chance * boostMultiplier + petData.chance;
									} else
										warn(
											`Issue with hatching pets with luck enabled. Could not find pet with id ${
												pet.petId + 1
											} from ${egg} while applying new chances. Egg still hatched though, so potential issues could arise.`,
										);
								}
							} else {
								if (pet.petId === maxId) {
									continue;
								} else {
									const nextPet = registeredPets.find((petData) => petData.petId === pet.petId + 1);
									if (nextPet !== undefined) {
										const oldPetChance = pet.petChance;
										pet.petChance = nextPet.petChance - petData.chance;
										newLeastRarePetChance = newLeastRarePetChance - (oldPetChance - pet.petChance);

										if (pet.petId === leastRarePet.petId) {
											if (pet.petChance < newLeastRarePetChance) {
												newLeastRarePetChance = pet.petChance - 1;
											}
										}
									} else
										warn(
											`Issue with hatching pets with luck enabled. Could not find pet with id ${
												pet.petId + 1
											} from ${egg} while applying new chances. Egg still hatched though, so potential issues could arise.`,
										);
								}
							}
						}
					} else
						warn(
							`Issue with hatching pets with luck enabled. Could not find pet with id ${i} from ${egg}. Egg still hatched though, so potential issues could arise.`,
						);
				}

				if (newLeastRarePetChance < 1) {
					newLeastRarePetChance = 1;
				}

				leastRarePet.petChance = newLeastRarePetChance;
			}
		}
	}

	return registeredPets;
}
