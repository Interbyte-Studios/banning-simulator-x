import { DataStoreService } from "@rbxts/services";

/**
 * Represents an ordered datastore.
 */
export class LeaderboardDataStore {
	private orderedDatastore: OrderedDataStore;

	/**
	 * Creates a new OrderedDataStore.
	 *
	 * @param name The name of the datastore.
	 */
	constructor(name: string) {
		this.orderedDatastore = DataStoreService.GetOrderedDataStore(name);
	}

	/**
	 * Sets the value associated with the given playerId in the datastore.
	 *
	 * @param userId The id of the player in string format.
	 * @param value The value to be stored.
	 * @returns A Promise that resolves when the data is set.
	 */
	async setAsync(userId: string, value: number): Promise<void> {
		try {
			this.orderedDatastore.SetAsync(userId, value);
		} catch (e) {
			warn(`Failed to set value for key "${userId}": ${error}`);
		}
	}

	/**
	 * Gets the value associated with the given playerId from the datastore.
	 *
	 * @param userId The id of the player in string format.
	 * @returns A Promise that resolves to the value, or undefined if not found.
	 */
	async getAsync(userId: string): Promise<number | undefined> {
		try {
			return this.orderedDatastore.GetAsync(userId);
		} catch (error) {
			warn(`Failed to get value for key "${userId}": ${error}`);
			return undefined;
		}
	}

	/**
	 * Retrieves sorted data from the datastore based on the values.
	 *
	 * @param isAscending Whether the data should be sorted in ascending order.
	 * @param amount The maximum number of results to retrieve.
	 * @returns A Promise that resolves to an array of sorted [key, value] pairs.
	 */
	async getSortedAsync(isAscending: boolean, amount: number): Promise<Array<[string, number]>> {
		const sortedData: Array<[string, number]> = [];

		try {
			const data = this.orderedDatastore.GetSortedAsync(isAscending, amount);
			let page = data.GetCurrentPage();
			while (page.size() > 0) {
				for (const entry of page) {
					sortedData.push([entry.key, entry.value as number]);
				}
				if (sortedData.size() >= amount) break;
				data.AdvanceToNextPageAsync();
				page = data.GetCurrentPage();
			}
		} catch (error) {
			warn(`Failed to get sorted data: ${error}`);
		}

		return sortedData;
	}

	/**
	 * Removes the given key and its associated value from the datastore.
	 *
	 * @param userId The id of the player in string format.
	 * @returns A Promise that resolves when the data is removed.
	 */
	async removeAsync(userId: string): Promise<void> {
		try {
			this.orderedDatastore.RemoveAsync(userId);
		} catch (error) {
			warn(`Failed to remove key "${userId}": ${error}`);
		}
	}
}
