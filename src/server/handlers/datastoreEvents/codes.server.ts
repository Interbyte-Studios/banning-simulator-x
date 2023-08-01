debug.setmemorycategory("codesHandlers");
import { DataStoreService } from "@rbxts/services";
import { isValidStoredCodeCache, setCodesCache } from "server/modules/datastore/codes";

const datastoreEventsStore = DataStoreService.GetDataStore("DataStoreEvents", "Codes");
const codesKey = "ActiveCodes";
const getAsyncInterval = 60;

/**
 * Requests Roblox's DataStoreService to return all active codes in the game.
 */
function updateCodesCache(): void {
	const [success, dataOrError] = pcall(() => {
		const [data] = datastoreEventsStore.GetAsync(codesKey);
		if (!isValidStoredCodeCache(data)) {
			throw `Expected stored code cache to be a valid format.`;
		}

		return data;
	});

	if (!success) {
		warn(`Failed to get stored code cache: ${dataOrError}`);
		return;
	}

	setCodesCache(dataOrError);
}

task.defer(() => {
	// eslint-disable-next-line no-constant-condition
	while (true) {
		updateCodesCache();
		task.wait(getAsyncInterval);
	}
});
