import { requestHatch } from "client/network";
import { EggNames } from "shared/configs/eggs";
import { Store } from "shared/rodux";

/**
 * Handles the purchasing of an egg.
 *
 * @param eggName The name of the egg.
 * @param store The player's store.
 * @param isVoid Whether or not the egg is void.
 */
export function purchaseEgg(eggName: EggNames, store: Store, isVoid: boolean): void {
	// todo: check that user owns world egg comes from
	// check that user owns world

	// todo: check that user owns the zone the egg comes from
	// check that user owns zone

	// todo: check that user has enough currency
	// check for currency

	// todo: check that user has enough space to hatch the eggs
	// check inventory space

	requestHatch.SendToServer(eggName, isVoid);
}
