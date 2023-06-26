import { ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";
import { Variants } from "shared/configs/pets";

export const isValidPetHatchCount = t.array(
	t.interface({
		id: t.number,
		variants: t.interface({
			regular: t.number,
			void: t.number,
			radiant: t.number,
		}),
	}),
);

type ExistCache = Array<{
	petId: number;
	variants: {
		[variant in Variants]: {
			added: number;
			removed: number;
		};
	};
}>;
let newExistCache: ExistCache = [];

/**
 * Updates the local server cache of pet hatch counts for a specific pet.
 *
 * @param petId The pet ID to set the counter for.
 * @param variant The variant of the pet.
 * @param count The amount of this pet that exists globally.
 */
export function setPetCount(petId: number, variant: Variants, count: number): void {
	let petExistCache = ReplicatedStorage.PetExistStores.FindFirstChild(petId) as Configuration;
	if (petExistCache === undefined) {
		petExistCache = new Instance("Configuration");
		petExistCache.Name = tostring(petId);
		petExistCache.Parent = ReplicatedStorage.PetExistStores;
	}

	let variantCache = petExistCache.FindFirstChild(variant) as IntValue;
	if (variantCache === undefined) {
		variantCache = new Instance("IntValue");
		variantCache.Name = variant;
		variantCache.Parent = petExistCache;
	}

	variantCache.Value = count;
}

/**
 * Modifies the global pet counter of how many of a certain `petId` exist in the game.
 *
 * @param counter A table containing information about how to modify the counter for a specified pet.
 */
export function modifyPetCount(
	counter:
		| { type: "addPet"; petId: number; variant: Variants }
		| { type: "deletePet"; petId: number; variant: Variants; amount: number },
): void {
	let currentAmount = 0;

	const petExistCache = ReplicatedStorage.PetExistStores.FindFirstChild(tostring(counter.petId)) as Configuration;
	if (petExistCache !== undefined) {
		const variantCache = petExistCache.FindFirstChild(counter.variant) as IntValue;
		if (variantCache !== undefined) {
			currentAmount += variantCache.Value;
		}
	}

	if (counter.type === "addPet") {
		// record count locally
		setPetCount(counter.petId, counter.variant, currentAmount + 1);

		// append to changes to perform to datastore
		const existingCache = newExistCache.find((petCache) => petCache.petId === counter.petId);
		if (existingCache !== undefined) {
			existingCache.variants[counter.variant].added += 1;
		} else {
			const newCache = {
				petId: counter.petId,
				variants: {
					regular: {
						added: 0,
						removed: 0,
					},
					void: {
						added: 0,
						removed: 0,
					},
					radiant: {
						added: 0,
						removed: 0,
					},
				},
			};

			newCache.variants[counter.variant].added += 1;
			newExistCache.push(newCache);
		}
	} else {
		if (currentAmount === 0) {
			return;
		}

		// record locally
		setPetCount(counter.petId, counter.variant, currentAmount - counter.amount);

		// append to datastore
		const existingCache = newExistCache.find((petCache) => petCache.petId === counter.petId);
		if (existingCache !== undefined) {
			existingCache.variants[counter.variant].removed -= counter.amount;
		} else {
			const newCache = {
				petId: counter.petId,
				variants: {
					regular: {
						added: 0,
						removed: 0,
					},
					void: {
						added: 0,
						removed: 0,
					},
					radiant: {
						added: 0,
						removed: 0,
					},
				},
			};

			newCache.variants[counter.variant].removed -= counter.amount;
			newExistCache.push(newCache);
		}
	}
}

/**
 * @returns The server cache for hatched pets.
 */
export function getPetExistCache(): ExistCache {
	return newExistCache;
}

/**
 * Sets the server's cache of newly hatched pet IDs.
 *
 * @param newPets The newly hatched pets.
 */
export function setNewHatchedPets(newPets: ExistCache): void {
	newExistCache = newPets;
}
