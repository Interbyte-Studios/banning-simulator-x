import { DataStoreService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { t } from "@rbxts/t";

const datastoreEventsStore = DataStoreService.GetDataStore("DataStoreEvents", "Events");
const eventsKey = "BSX_DataStoreEvents";
const getAsyncInterval = 60;

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
	tradingEnabled: t.boolean,
});
export type ValidDatastoreEventCache = t.static<typeof validDatastoreEventCache>;

/**
 * Reads the value of the datastore events DataStore.
 */
function updateDatastoreEventCache(): void {
	const [success, dataOrError] = pcall(() => {
		const [data] = datastoreEventsStore.GetAsync(eventsKey);

		if (!validDatastoreEventCache(data)) {
			throw `Expected data store event cache to be valid.`;
		}

		return data;
	});

	if (!success) {
		warn(`Failed to get datastore events cache from global data store: ${dataOrError}`);
		return;
	}

	const { currencyEvent, experienceEvent, luckEvent, tradingEnabled } = dataOrError;

	ReplicatedStorage.events.currency.enabled.Value = currencyEvent.enabled;
	ReplicatedStorage.events.currency.multiplier.Value = currencyEvent.multiplier;

	ReplicatedStorage.events.experience.enabled.Value = experienceEvent.enabled;
	ReplicatedStorage.events.experience.multiplier.Value = experienceEvent.multiplier;

	ReplicatedStorage.events.luck.enabled.Value = luckEvent;
	ReplicatedStorage.events.trading.enabled.Value = tradingEnabled;

	ReplicatedStorage.events.timeUpdated.Value = Workspace.GetServerTimeNow();
}

task.defer(() => {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		updateDatastoreEventCache();
		task.wait(getAsyncInterval);
	}
});
