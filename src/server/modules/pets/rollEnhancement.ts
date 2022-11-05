import { ENHANCEMENTS, EnhancePetMetadata } from "shared/configs/enchantments";
import { Variants } from "shared/configs/pets";

/**
 * Rolls a random enhancement for a pet based on RNG.
 *
 * @param variant The requested variant to roll for.
 * @param id The id of the pet.
 * @returns A random enhancement.
 */
export function rollEnhancement(variant: Variants, id: number): Omit<EnhancePetMetadata, "variant"> | undefined {
	const potentialEnhancements: Array<Omit<EnhancePetMetadata, "variant">> = [];
	for (const [category, data] of pairs(ENHANCEMENTS.pets)) {
		for (const [rarity, _enhancementData] of pairs(data)) {
			if (_enhancementData.availableSlots.includes(variant)) {
				potentialEnhancements.push({
					category,
					rarity,
				});
			}
		}
	}

	let selectedEnhancement: Omit<EnhancePetMetadata, "variant"> | undefined;
	const randomNumber = new Random().NextInteger(0, 100);
	if (variant === "regular") {
		if (randomNumber > 99) {
			const artifactEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "artifact");
			const randomIndex = new Random().NextInteger(0, artifactEnhancements.size());

			selectedEnhancement = artifactEnhancements[randomIndex];
		} else if (randomNumber >= 70) {
			const rareEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "rare");
			const randomIndex = new Random().NextInteger(0, rareEnhancements.size());

			selectedEnhancement = rareEnhancements[randomIndex];
		} else {
			const basicEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "basic");
			const randomIndex = new Random().NextInteger(0, basicEnhancements.size());

			selectedEnhancement = basicEnhancements[randomIndex];
		}
	} else if (variant === "void") {
		if (randomNumber > 99) {
			const artifactEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "artifact");
			const randomIndex = new Random().NextInteger(0, artifactEnhancements.size());

			selectedEnhancement = artifactEnhancements[randomIndex];
		} else if (randomNumber >= 95) {
			const legendaryEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "legendary");
			const randomIndex = new Random().NextInteger(0, legendaryEnhancements.size());

			selectedEnhancement = legendaryEnhancements[randomIndex];
		} else if (randomNumber >= 80) {
			const epicEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "epic");
			const randomIndex = new Random().NextInteger(0, epicEnhancements.size());

			selectedEnhancement = epicEnhancements[randomIndex];
		} else if (randomNumber >= 50) {
			const rareEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "rare");
			const randomIndex = new Random().NextInteger(0, rareEnhancements.size());

			selectedEnhancement = rareEnhancements[randomIndex];
		} else {
			const basicEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "basic");
			const randomIndex = new Random().NextInteger(0, basicEnhancements.size());

			selectedEnhancement = basicEnhancements[randomIndex];
		}
	} else if (variant === "radiant") {
		if (randomNumber > 99) {
			const artifactEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "artifact");
			const randomIndex = new Random().NextInteger(0, artifactEnhancements.size());

			selectedEnhancement = artifactEnhancements[randomIndex];
		} else if (randomNumber >= 95) {
			const legendaryEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "legendary");
			const randomIndex = new Random().NextInteger(0, legendaryEnhancements.size());

			selectedEnhancement = legendaryEnhancements[randomIndex];
		} else if (randomNumber >= 80) {
			const epicEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "epic");
			const randomIndex = new Random().NextInteger(0, epicEnhancements.size());

			selectedEnhancement = epicEnhancements[randomIndex];
		} else if (randomNumber >= 50) {
			const rareEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "rare");
			const randomIndex = new Random().NextInteger(0, rareEnhancements.size());

			selectedEnhancement = rareEnhancements[randomIndex];
		} else {
			const basicEnhancements = potentialEnhancements.filter((enhancement) => enhancement.rarity === "basic");
			const randomIndex = new Random().NextInteger(0, basicEnhancements.size());

			selectedEnhancement = basicEnhancements[randomIndex];
		}
	}

	if (selectedEnhancement === undefined) {
		return;
	}

	return selectedEnhancement;
}
