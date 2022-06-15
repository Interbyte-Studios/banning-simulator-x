import { EggNames } from "shared/configs/eggs";
import { Store } from "shared/rodux";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getPetInventorySize } from "shared/util/getPetInventorySize";

interface TryEggPurchase {
	success: boolean;
	wasAutoDeleted: boolean;
}

/**
 * Runs checks to ensure a player can hatch a given egg.
 *
 * @param store The store of the player purchasing the egg.
 * @param eggName The name of the egg.
 * @param petId The id of the pet to purchase.
 * @param isVoid Whether or not the egg is void.
 * @returns Whether or not the purchase was successful.
 */
export function purchaseEgg(store: Store, eggName: EggNames, petId: number, isVoid: boolean): TryEggPurchase {
	const currentState = store.getState();
	const eggData = getEggData(eggName);
	const eggCost = getEggCost(eggName, isVoid);

	// check that user owns world
	const ownsWorld = currentState.worlds.find((x) => x.name === eggData.world);
	if (ownsWorld === undefined) {
		return {
			success: false,
			wasAutoDeleted: false,
		};
	}

	// check that user owns zone
	const ownsZone = ownsWorld.zones.find((x) => x.name === eggData.zone);
	if (ownsZone === undefined) {
		return {
			success: false,
			wasAutoDeleted: false,
		};
	}

	// check for currency
	if (currentState.currencies[eggCost.currencyType] < eggCost.amount) {
		return {
			success: false,
			wasAutoDeleted: false,
		};
	}

	// check inventory space
	if (currentState.pets.size() >= getPetInventorySize(store) + 1) {
		return {
			success: false,
			wasAutoDeleted: false,
		};
	}

	// todo: check if it should be auto deleted

	// register pet
	return {
		success: true,
		wasAutoDeleted: false,
	};
}
