import { DataStoreService, ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";

const datastoreEventsStore = DataStoreService.GetDataStore("DataStoreEvents", "Events");
const eventsKey = "BSX_DataStoreEvents";
const getAsyncInterval = 60 * 30;

const validDatastoreEventCache = t.strictInterface({
	x2CurrencyEvent: t.boolean,
	x2ExperienceEvent: t.boolean,
	x2LuckEvent: t.boolean,
	x3CurrencyEvent: t.boolean,
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

	ReplicatedStorage.events.x2Currency.Value = datastoreEventCache.x2CurrencyEvent;
	ReplicatedStorage.events.x2Experience.Value = datastoreEventCache.x2ExperienceEvent;
	ReplicatedStorage.events.x3Currency.Value = datastoreEventCache.x3CurrencyEvent;
	ReplicatedStorage.events.x2Luck.Value = datastoreEventCache.x2LuckEvent;
}

task.spawn(() => {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		updateDatastoreEventCache();
		task.wait(getAsyncInterval);
	}
});
