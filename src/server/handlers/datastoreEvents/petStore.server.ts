import { DataStoreService, ReplicatedStorage } from "@rbxts/services";
import {
	getHatchCount,
	isValidPetHatchCount,
	newHatchedPets,
	setNewHatchedPets,
	updateHatchCount,
} from "server/modules/datastore/pets";

const datastoreEventsStore = DataStoreService.GetDataStore("DataStoreEvents", "PetStore");

const PET_HATCH_KEY = "BSX_PetsStore";

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
	const newPets = getHatchCount();
	setNewHatchedPets([]);

	const [writeSuccess, newCache] = pcall(() => {
		return datastoreEventsStore.UpdateAsync(PET_HATCH_KEY, (globalData) => {
			if (!isValidPetHatchCount(globalData)) {
				throw `DataStore hatch count was in invalid format`;
			}

			for (const petId of newPets) {
				let globalCount = globalData.find((pet) => pet.id === petId);
				if (globalCount === undefined) {
					globalCount = {
						id: petId,
						existingAmount: 0,
					};
					globalData.push(globalCount);
				}
				globalCount.existingAmount += 1;
			}

			return $tuple(globalData);
		});
	});

	if (writeSuccess) {
		updateHatchCount(newCache);

		// remove each pet that we added
		for (const petId of newPets) {
			const petIndex = newHatchedPets.findIndex((id) => id === petId);
			if (petIndex !== -1) {
				newHatchedPets.unorderedRemove(petIndex);
			}
		}

		updateHatchCount(newCache);

		for (const pet of newCache) {
			ReplicatedStorage.PetExistStores.SetAttribute(tostring(pet.id), pet.existingAmount);
		}
	} else {
		// we failed to update the global data store
		// let's add all the pets back to the server cache
		for (const pet of newPets) {
			newHatchedPets.push(pet);
		}
	}
}

task.spawn(() => {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		updateGlobalCache();
		task.wait(20);
	}
});

game.BindToClose(updateGlobalCache);
