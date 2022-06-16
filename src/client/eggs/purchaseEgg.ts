import { Players, RunService } from "@rbxts/services";
import { requestHatch } from "client/network";
import { AnimateEggs } from "client/ui/components/eggs/eggHatch/animateEggs";
import { EggName } from "shared/configs/eggs";
import { Store } from "shared/rodux";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getPetInventorySize } from "shared/util/getPetInventorySize";

import { canHatchEgg } from "./canHatchEgg";

/**
 * Handles the purchasing of an egg.
 *
 * @param store The player's store.
 * @param amount The amount of eggs to hatch.
 * @param eggName The name of the egg.
 * @param isVoid Whether or not the egg is void.
 */
export function purchaseEgg(store: Store, amount: 1 | 3, eggName: EggName, isVoid: boolean): void {
	// check that the user has waited long enough to hatch eggs
	if (!canHatchEgg(AnimateEggs.lasHatchTime)) {
		return;
	}

	const currentState = store.getState();
	const eggData = getEggData(eggName);
	const eggCost = getEggCost(eggName, isVoid);

	// check that user owns world
	const ownsWorld = currentState.worlds.find((x) => x.name === eggData.world);
	if (ownsWorld === undefined) {
		return;
	}

	// check that user owns zone
	const ownsZone = ownsWorld.zones.find((x) => x.name === eggData.zone);
	if (ownsZone === undefined) {
		return;
	}

	// check for currency
	if (eggCost.amount * amount > currentState.currencies[eggCost.currencyType]) {
		return;
	}

	// check inventory space
	if (currentState.pets.size() >= getPetInventorySize(store) + amount) {
		return;
	}

	requestHatch.SendToServer(amount, eggName, isVoid);
}

let activelyWatching = false;

/**
 * Checks whether or not player owns auto hatch and responds accordingly.
 *
 * @param store The player's store.
 * @param amount The amount of eggs to hatch.
 * @param eggName The name of the egg.
 * @param isVoid Whether or not the egg is void.
 */
export function handleEggPurchase(store: Store, amount: 1 | 2 | 3, eggName: EggName, isVoid: boolean): void {
	if (activelyWatching) {
		return;
	}

	const currentState = store.getState();
	if (currentState.settings.autoHatch) {
		const player = Players.LocalPlayer;

		const character = player.Character;
		if (character === undefined) {
			return;
		}

		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (humanoid === undefined) {
			return;
		}

		activelyWatching = true;

		RunService.BindToRenderStep("autoHatch", Enum.RenderPriority.Last.Value, () => {
			if (!canHatchEgg(AnimateEggs.lasHatchTime)) {
				return;
			}

			purchaseEgg(store, amount, eggName, isVoid);
		});

		const connection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
			activelyWatching = false;
			RunService.UnbindFromRenderStep("autoHatch");
			connection.Disconnect();
		});
	} else {
		purchaseEgg(store, amount, eggName, isVoid);
	}
}
