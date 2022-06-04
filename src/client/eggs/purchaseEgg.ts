import { requestHatch } from "client/network";
import { EggNames } from "shared/configs/eggs";
import { Store } from "shared/rodux";

import { canHatchEgg } from "./canHatchEgg";

/**
 * Handles the purchasing of an egg.
 *
 * @param amount The amount of eggs to hatch.
 * @param eggName The name of the egg.
 * @param isVoid Whether or not the egg is void.
 * @param store The player's store.
 */
export function purchaseEgg(amount: 1 | 2 | 3, eggName: EggNames, isVoid: boolean, store: Store): void {
	// check that the user has waited long enough to hatch eggs
	const canHatch = canHatchEgg();
	if (canHatch === false) return;

	// todo: check that user owns world egg comes from
	// check that user owns world

	// todo: check that user owns the zone the egg comes from
	// check that user owns zone

	// todo: check that user has enough currency
	// check for currency

	// todo: check that user has enough space to hatch the eggs
	// check inventory space

	requestHatch.SendToServer(amount, eggName, isVoid);
}
