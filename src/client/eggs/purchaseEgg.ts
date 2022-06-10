import { Players, RunService } from "@rbxts/services";
import { requestHatch } from "client/network";
import { EggNames } from "shared/configs/eggs";
import { Store } from "shared/rodux";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getPetInventorySize } from "shared/util/getPetInventorySize";

import { canHatchEgg } from "./canHatchEgg";

let activelyWatching = false;

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

	const currentState = store.getState();
	const eggData = getEggData(eggName);
	const eggCost = getEggCost(eggName, isVoid);

	// check that user owns world
	const ownsWorld = currentState.worlds.find((x) => x.name === eggData.world);
	if (ownsWorld === undefined) {
		warn(`User does not own ${eggData.world} World, and therefore canot purchase the ${eggName} egg.`);
		return;
	}

	// check that user owns zone
	const ownsZone = ownsWorld.zones.find((x) => x.name === eggData.zone);
	if (ownsZone === undefined) {
		warn(`User does not own ${eggData.zone} Zone, and therefore canot purchase the ${eggName} egg.`);
		return;
	}

	// check for currency
	let amountToBeHatched = 0;
	switch (amount) {
		case 1: {
			if (currentState.currencies[eggCost.currencyType] < eggCost.amount) {
				return;
			}
			amountToBeHatched += 1;
			break;
		}
		case 2:
		case 3: {
			for (let i = 1; i <= amount; i++) {
				if (currentState.currencies[eggCost.currencyType] >= eggCost.amount * i) {
					amountToBeHatched += 1;
				}
			}
			break;
		}
	}
	if (amountToBeHatched <= 0 || amountToBeHatched > 3) return;

	// check inventory space
	if (currentState.pets.size() >= getPetInventorySize(store) + amountToBeHatched) {
		warn(`User does not have enough inventory space to hatch the ${eggName} egg.`);
		return;
	}

	requestHatch.SendToServer(amountToBeHatched as 1 | 2 | 3, eggName, isVoid);
}

/**
 * Checks whether or not player owns auto hatch and responds accordingly.
 *
 * @param amount The amount of eggs to hatch.
 * @param eggName The name of the egg.
 * @param isVoid Whether or not the egg is void.
 * @param store The player's store.
 */
export function handleEggPurchase(amount: 1 | 2 | 3, eggName: EggNames, isVoid: boolean, store: Store): void {
	if (activelyWatching) return;

	const currentState = store.getState();
	if (currentState.settings.autoHatch) {
		const player = Players.LocalPlayer;

		const character = player.Character;
		if (character === undefined) return;

		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (humanoid === undefined) return;

		activelyWatching = true;

		RunService.BindToRenderStep("autoHatch", Enum.RenderPriority.Last.Value, () => {
			const canHatch = canHatchEgg();
			if (!canHatch) return;

			purchaseEgg(amount, eggName, isVoid, store);
		});

		const connection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
			activelyWatching = false;
			RunService.UnbindFromRenderStep("autoHatch");
			connection.Disconnect();
		});
	} else {
		purchaseEgg(amount, eggName, isVoid, store);
	}
}
