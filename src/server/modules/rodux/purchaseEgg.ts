import { EggNames } from "shared/configs/eggs";
import { Store } from "shared/rodux";
import { addPet as dispatchAddPet } from "shared/rodux/pets";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getPetInventorySize } from "shared/util/getPetInventorySize";

interface TryEggPurchase {
	success: boolean;
	wasAutoDeleted: boolean;
}

/**
 * Purchases a weapon for a player.
 *
 * @param store The store to equip the weapon for.
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
		warn(`User does not own ${eggData.world} World, and therefore canot purchase the ${eggName} egg.`);
		return {
			success: false,
			wasAutoDeleted: false,
		};
	}

	// check that user owns zone
	const ownsZone = ownsWorld.zones.find((x) => x.name === eggData.zone);
	if (ownsZone === undefined) {
		warn(`User does not own ${eggData.zone} Zone, and therefore canot purchase the ${eggName} egg.`);
		return {
			success: false,
			wasAutoDeleted: false,
		};
	}

	// check for currency
	if (currentState.currencies[eggCost.currencyType] < eggCost.amount) {
		warn(
			`User has ${currentState.currencies[eggCost.currencyType]} ${
				eggCost.currencyType
			}, which is not enough to purchase ${eggName}`,
		);
		return {
			success: false,
			wasAutoDeleted: false,
		};
	}

	// check inventory space
	if (currentState.pets.size() >= getPetInventorySize(store) + 1) {
		warn(`User does not have enough inventory space to hatch the ${eggName} egg.`);
		return {
			success: false,
			wasAutoDeleted: false,
		};
	}

	// todo: check if it should be auto deleted

	// register pet
	store.dispatch(dispatchAddPet(eggName, petId, isVoid ? "void" : "regular"));
	return {
		success: true,
		wasAutoDeleted: false,
	};
}
