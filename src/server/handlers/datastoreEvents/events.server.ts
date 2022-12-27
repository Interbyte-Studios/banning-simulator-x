import { DataStoreService, ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";

const datastoreEventsStore = DataStoreService.GetDataStore("DataStoreEvents", "Events");
const eventsKey = "BSX_DataStoreEvents";
const getAsyncInterval = 60 * 30;

const validDatastoreEventCache = t.strictInterface({
	currencyEvent: t.strictInterface({
		enabled: t.boolean,
		multiplier: t.number,
	}),
	experienceEvent: t.strictInterface({
		enabled: t.boolean,
		multiplier: t.number,
	}),
	luckEvent: t.boolean,
});
export type ValidDatastoreEventCache = t.static<typeof validDatastoreEventCache>;

let datastoreEventCache: ValidDatastoreEventCache;

/**
 * Reads the value of the datastore events DataStore.
 */
function updateDatastoreEventCache(): void {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [success] = pcall(() => {
		const [data] = datastoreEventsStore.GetAsync(eventsKey);

		if (!validDatastoreEventCache(data)) {
			throw `Expected data store event cache to be valid.`;
		}

		datastoreEventCache = data;
	});

	if (!success) {
		throw `Failed to get datastore events cache from global data store.`;
	}

	ReplicatedStorage.events.currency.enabled.Value = datastoreEventCache.currencyEvent.enabled;
	ReplicatedStorage.events.currency.multiplier.Value = datastoreEventCache.currencyEvent.multiplier;

	ReplicatedStorage.events.experience.enabled.Value = datastoreEventCache.experienceEvent.enabled;
	ReplicatedStorage.events.experience.multiplier.Value = datastoreEventCache.experienceEvent.multiplier;

	ReplicatedStorage.events.luck.enabled.Value = datastoreEventCache.luckEvent;
}

task.spawn(() => {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		updateDatastoreEventCache();
		task.wait(getAsyncInterval);
	}
});
