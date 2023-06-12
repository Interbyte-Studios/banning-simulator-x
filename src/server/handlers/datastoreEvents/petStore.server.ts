import { DataStoreService, ReplicatedStorage } from "@rbxts/services";
import {
	datastoreName,
	datastoreScope,
	eventsKey,
	getLocalPetsCache,
	getPetsCache,
	setLocalPetCache,
	setPetsCache,
	validPetExistCache,
} from "server/modules/datastoreCaches/petExistStore";

const datastoreEventsStore = DataStoreService.GetDataStore(datastoreName, datastoreScope);

/**
 * Retrieves the cache of existing secret pets.
 */
function getPetExistStore(): void {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [success] = pcall(() => {
		const [data] = datastoreEventsStore.GetAsync(eventsKey);

		if (!validPetExistCache(data)) {
			throw `Expected data store pet exist cache to be valid.`;
		}

		for (const cachedPetExistAmount of data) {
			const cachedAmount = getPetsCache().find((petExistCache) => petExistCache.id === cachedPetExistAmount.id);
			if (cachedAmount === undefined) {
				setPetsCache([...getPetsCache(), cachedPetExistAmount]);
				continue;
			}

			cachedAmount.existingAmount = cachedPetExistAmount.existingAmount;
		}

		const newPetsCache = getPetsCache();

		for (const petData of newPetsCache) {
			ReplicatedStorage.PetExistStores.SetAttribute(tostring(petData.id), petData.existingAmount);
		}

		setLocalPetCache(newPetsCache);
	});

	if (!success) {
		throw `Failed to get datastore events cache from global data store.`;
	}
}

/**
 * Compares the locally stored cache to the datastore for updates.
 */
function compareCaches(): void {
	datastoreEventsStore.UpdateAsync(eventsKey, (cachedData) => {
		if (!validPetExistCache(cachedData)) {
			throw `Expected stored pet exist cache to valid.`;
		}

		const currentStoreCache = getPetsCache();
		const newData = cachedData;

		for (const petData of getLocalPetsCache()) {
			const oldCachedPetData = currentStoreCache.find((pet) => pet.id === petData.id);
			if (oldCachedPetData === undefined) {
				continue;
			}

			const cachedPetData = newData.find((pet) => pet.id === petData.id);
			if (cachedPetData === undefined) {
				continue;
			}

			if (petData.existingAmount < oldCachedPetData.existingAmount) {
				continue;
			}

			const increment = petData.existingAmount - oldCachedPetData.existingAmount;
			cachedPetData.existingAmount += increment;
		}

		setPetsCache(newData);
		setLocalPetCache(newData);

		for (const petData of newData) {
			ReplicatedStorage.PetExistStores.SetAttribute(tostring(petData.id), petData.existingAmount);
		}

		return [newData] as LuaTuple<[newValue: unknown]>;
	});
}

task.spawn(() => {
	getPetExistStore();

	// eslint-disable-next-line no-constant-condition
	while (true) {
		task.wait(60 * 5);
		compareCaches();
	}
});
