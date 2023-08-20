import { Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { EggName, isEventEgg, isExclusiveEgg } from "shared/configs/eggs";
import { PET_MASTERY_REQUIREMENTS } from "shared/configs/petMastery";
import { Variants } from "shared/configs/pets";
import { getEggData } from "shared/util/getEggData";

/**
 * Gets the number of unclaimed challenges for a given egg.
 *
 * @param eggName The name of the egg to get the unclaimed challenges for.
 * @param specificVariant The variant of the pet to get the unclaimed challenges for. If undefined, all variants will be counted.
 * @returns The number of unclaimed challenges for the given egg.
 */
export function getPetMasteryUnclaimedChallenges(eggName: EggName, specificVariant?: Variants): number {
	const store = retrieveStore(Players.LocalPlayer);
	if (store === undefined) {
		return 0;
	}

	if (eggName === "Exclusive") {
		return 0;
	}

	const currentState = store.getState();
	const index = currentState.index;
	const petMastery = currentState.petMastery;

	const eggData = getEggData(eggName);

	let unseenChallenges = 0;
	for (const [, petData] of pairs(eggData.pets)) {
		const discoveredPet = index.pets.find((index) => index.id === petData.id);
		if (discoveredPet !== undefined) {
			const petMasteryPet = petMastery.find((mastery) => mastery.id === petData.id);
			const petMasteryRequirements = PET_MASTERY_REQUIREMENTS[petData.rarity];

			let radiantUnseen = 0;
			let voidUnseen = 0;
			let regularUnseen = 0;

			if (discoveredPet.index.fused.radiant >= petMasteryRequirements.radiant.fuse) {
				if (petMasteryPet === undefined || !petMasteryPet.mastery.radiant.fuseClaimed) {
					radiantUnseen++;
				}
			}

			if (discoveredPet.index.maxLevel.radiant >= petMasteryRequirements.radiant.maxLevel) {
				if (petMasteryPet === undefined || !petMasteryPet.mastery.radiant.maxLevelClaimed) {
					radiantUnseen++;
				}
			}

			if (discoveredPet.index.fused.void >= petMasteryRequirements.void.fuse) {
				if (petMasteryPet === undefined || !petMasteryPet.mastery.void.fuseClaimed) {
					voidUnseen++;
				}
			}

			if (discoveredPet.index.hatched.void >= petMasteryRequirements.void.hatch) {
				if (!isEventEgg(eggName) && !isExclusiveEgg(eggName)) {
					if (eggData.id < 100) {
						if (petMasteryPet === undefined || !petMasteryPet.mastery.void.hatchClaimed) {
							voidUnseen++;
						}
					}
				}
			}

			if (discoveredPet.index.maxLevel.void >= petMasteryRequirements.void.maxLevel) {
				if (petMasteryPet === undefined || !petMasteryPet.mastery.void.maxLevelClaimed) {
					voidUnseen++;
				}
			}

			if (discoveredPet.index.hatched.regular >= petMasteryRequirements.regular.hatch) {
				if (eggData.id < 100) {
					if (petMasteryPet === undefined || !petMasteryPet.mastery.regular.hatchClaimed) {
						regularUnseen++;
					}
				}
			}

			if (discoveredPet.index.maxLevel.regular >= petMasteryRequirements.regular.maxLevel) {
				if (petMasteryPet === undefined || !petMasteryPet.mastery.regular.maxLevelClaimed) {
					regularUnseen++;
				}
			}

			if (specificVariant === undefined) {
				unseenChallenges += radiantUnseen + voidUnseen + regularUnseen;
			} else if (specificVariant === "radiant") {
				unseenChallenges += radiantUnseen;
			} else if (specificVariant === "void") {
				unseenChallenges += voidUnseen;
			} else if (specificVariant === "regular") {
				unseenChallenges += regularUnseen;
			}
		}
	}
	return unseenChallenges;
}
