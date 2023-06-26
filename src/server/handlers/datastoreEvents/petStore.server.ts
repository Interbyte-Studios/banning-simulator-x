import { DataStoreService } from "@rbxts/services";
import { getPetExistCache, isValidPetHatchCount, setNewHatchedPets, setPetCount } from "server/modules/datastore/pets";

const datastoreEventsStore = DataStoreService.GetDataStore("DataStoreEvents", "PetStore");
const PET_HATCH_KEY = "BSX_PetsStore";
const getAsyncInterval = 30;

/**
 * Attempts to write the server cache of newly hatched pets to the global cache.
 *
 * At the same time, after retrieval, updates the server with the global cache.
 *
 * If failures occur, the server cache will remain intact.
 */
function updateGlobalCache(): void {
	// this gets a bit tricky for a second:
	// we want to temporarily lock the server's cache
	// so that we don't double-count when running the UpdateAsync callback
	const serverNewHatchedPets = getPetExistCache();
	setNewHatchedPets([]);

	const [writeSuccess, newCache] = pcall(() => {
		return datastoreEventsStore.UpdateAsync(PET_HATCH_KEY, (globalData) => {
			if (!isValidPetHatchCount(globalData)) {
				throw `DataStore hatch count was in invalid format`;
			}

			// add on our server's changes
			for (const petData of serverNewHatchedPets) {
				let globalCount = globalData.find((pet) => pet.id === petData.petId);
				if (globalCount === undefined) {
					globalCount = {
						id: petData.petId,
						variants: {
							regular: 0,
							void: 0,
							radiant: 0,
						},
					};
					globalData.push(globalCount);
				}

				for (const [name, modifiedCounter] of pairs(petData.variants)) {
					globalCount.variants[name] += modifiedCounter.added;
					globalCount.variants[name] -= modifiedCounter.removed;
				}
			}

			return $tuple(globalData);
		});
	});

	if (writeSuccess) {
		for (const petData of newCache) {
			for (const [name, amount] of pairs(petData.variants)) {
				setPetCount(petData.id, name, amount);
			}
		}
	} else {
		// we failed to update the global data store
		// let's add all the pets back to the server cache
		// the server cache has changed since we ran the UpdateAsync call
		// so we need to retrieve it again
		const changedServerHatchedPets = getPetExistCache();
		for (const pet of serverNewHatchedPets) {
			changedServerHatchedPets.push(pet);
		}
	}
}

task.spawn(() => {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		updateGlobalCache();
		task.wait(getAsyncInterval);
	}
});

game.BindToClose(updateGlobalCache);
