import { Players } from "@rbxts/services";
import { retrieveStore } from "client/clientStores";
import { EggName } from "shared/configs/eggs";
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

	const currentState = store.getState();
	const index = currentState.index;
	const petMastery = currentState.petMastery;

	const eggData = getEggData(eggName);

	let unseenChallenges = 0;
	for (const [, petData] of pairs(eggData.pets)) {
		const discoveredPet = index.pets.get(petData.id);
		if (discoveredPet !== undefined) {
			const petMasteryPet = petMastery.get(petData.id);
			const petMasteryRequirements = PET_MASTERY_REQUIREMENTS[petData.rarity];

			let radiantUnseen = 0;
			let voidUnseen = 0;
			let regularUnseen = 0;

			if (discoveredPet.fused.radiant >= petMasteryRequirements.radiant.fuse) {
				if (petMasteryPet === undefined || !petMasteryPet.radiant.fuseClaimed) {
					radiantUnseen++;
				}
			}

			if (discoveredPet.maxLevel.radiant.amount >= petMasteryRequirements.radiant.maxLevel) {
				if (petMasteryPet === undefined || !petMasteryPet.radiant.maxLevelClaimed) {
					radiantUnseen++;
				}
			}

			if (discoveredPet.fused.void >= petMasteryRequirements.void.fuse) {
				if (petMasteryPet === undefined || !petMasteryPet.void.fuseClaimed) {
					voidUnseen++;
				}
			}

			if (discoveredPet.hatched.void >= petMasteryRequirements.void.hatch) {
				if (petMasteryPet === undefined || !petMasteryPet.void.hatchClaimed) {
					voidUnseen++;
				}
			}

			if (discoveredPet.maxLevel.void.amount >= petMasteryRequirements.void.maxLevel) {
				if (petMasteryPet === undefined || !petMasteryPet.void.maxLevelClaimed) {
					voidUnseen++;
				}
			}

			if (discoveredPet.hatched.regular >= petMasteryRequirements.regular.hatch) {
				if (petMasteryPet === undefined || !petMasteryPet.regular.hatchClaimed) {
					regularUnseen++;
				}
			}

			if (discoveredPet.maxLevel.regular.amount >= petMasteryRequirements.regular.maxLevel) {
				if (petMasteryPet === undefined || !petMasteryPet.regular.maxLevelClaimed) {
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
