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
 * @returns An array of pets with calculated true percentages.
 */
export function getPetPercentages(egg: EggName): Array<RegisteredPet> {
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

	return registeredPets;
}
