import { t } from "@rbxts/t";
import { EGGS } from "shared/configs/eggs";

export const datastoreName = "DataStoreEvents";
export const datastoreScope = "PetStore";
export const eventsKey = "BSX_PetsStore";
export const updateStoreInterval = 60 * 60;

export const validPetExistCache = t.array(t.interface({ id: t.number, existingAmount: t.number }));
export type ValidPetExistCache = t.static<typeof validPetExistCache>;

export let petsCache: ValidPetExistCache = [];
export let petsToUpdate: ValidPetExistCache = [];

/**
 * @returns The value of the cached pet exist store.
 */
export function getPetsCache(): ValidPetExistCache {
	return petsCache;
}

/**
 * @returns The value of the locally cached pet exist store.
 */
export function getLocalPetsCache(): ValidPetExistCache {
	return petsToUpdate;
}

/**
 * Sets or overrides the cached pet exist store data.
 *
 * @param newValue The new cache.
 */
export function setPetsCache(newValue: ValidPetExistCache): void {
	if (!validPetExistCache(newValue)) {
		warn("Failed to set pet exist store cache. Was invalid.");
		return;
	}

	petsCache = newValue;
}

/**
 * Sets or overrides the locally cached pet exist store data.
 *
 * @param newValue The new cache.
 */
export function setLocalPetCache(newValue: ValidPetExistCache): void {
	if (!validPetExistCache(newValue)) {
		warn("Failed to set pet exist store cache. Was invalid.");
		return;
	}

	petsToUpdate = newValue;
}

/**
 * Adds a pet to the global cache for exising secret pets.
 *
 * @param petId The id of the pet to add.
 */
export function addPetToCache(petId: number): void {
	// verify it's a secret pet and add to cache
	for (const [, eggData] of pairs(EGGS)) {
		for (const [, petData] of pairs(eggData.pets)) {
			if (petData.id !== petId) {
				continue;
			}

			if (petData.rarity !== "Prismatic" && petData.rarity !== "Primordial") {
				return;
			}

			const newLocallyCachedPets = getLocalPetsCache().map((cachedData) => {
				if (cachedData.id === petId) {
					return {
						id: cachedData.id,
						existingAmount: cachedData.existingAmount + 1,
					};
				}

				return cachedData;
			});
			setLocalPetCache(newLocallyCachedPets);

			return;
		}
	}
}
