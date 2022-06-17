import { Players, RunService } from "@rbxts/services";
import { AnimateEggs } from "client/ui/components/eggs/eggHatch/animateEggs";
import { EggName } from "shared/configs/eggs";
import { CurrenciesState } from "shared/rodux/currencies";
import { GamepassesState } from "shared/rodux/gamepasses";
import { PetsState } from "shared/rodux/pets";
import { WorldsState } from "shared/rodux/worlds";
import { getEggCost } from "shared/util/getEggCost";
import { getEggData } from "shared/util/getEggData";
import { getPetInventorySize } from "shared/util/getPetInventorySize";

import { canHatchEgg } from "./canHatchEgg";

/**
 * Handles the purchasing of an egg.
 *
 * @param currenciesState The state of the player's currencies data.
 * @param gamepassesState The state of the player's gamepasses data.
 * @param petsState The state of the player's pet data.
 * @param worldsState The state of the player's owned world data.
 * @param amount The amount of eggs to hatch.
 * @param eggName The name of the egg.
 * @param isVoid Whether or not the egg is void.
 */
export function tryPurchaseEgg(
	currenciesState: CurrenciesState,
	gamepassesState: GamepassesState,
	petsState: PetsState,
	worldsState: WorldsState,
	amount: 1 | 3,
	eggName: EggName,
	isVoid: boolean,
): void {
	// check that the user has waited long enough to hatch eggs
	if (!canHatchEgg(AnimateEggs.lasHatchTime)) {
		return;
	}

	const eggData = getEggData(eggName);
	const eggCost = getEggCost(eggName, isVoid);

	// check that user owns world
	const ownsWorld = worldsState.find((x) => x.name === eggData.world);
	if (ownsWorld === undefined) {
		return;
	}

	// check that user owns zone
	const ownsZone = ownsWorld.zones.find((x) => x.name === eggData.zone);
	if (ownsZone === undefined) {
		return;
	}

	// check for currency
	if (eggCost.amount * amount > currenciesState[eggCost.currencyType]) {
		return;
	}

	// check inventory space
	if (petsState.size() >= getPetInventorySize(gamepassesState) + amount) {
		return;
	}

	requestHatch.SendToServer(amount, eggName, isVoid);
}

let activelyWatching = false;

/**
 * Checks whether or not player owns auto hatch and responds accordingly.
 *
 * @param currenciesState The state of the player's currencies data.
 * @param gamepassesState The state of the player's gamepasses data.
 * @param petsState The state of the player's pet data.
 * @param worldsState The state of the player's owned world data.
 * @param amount The amount of eggs to hatch.
 * @param autoEnabled Whether or not auto hatch is enabled or not.
 * @param eggName The name of the egg.
 * @param isVoid Whether or not the egg is void.
 */
export function handleEggPurchase(
	currenciesState: CurrenciesState,
	gamepassesState: GamepassesState,
	petsState: PetsState,
	worldsState: WorldsState,
	amount: 1 | 3,
	autoEnabled: boolean,
	eggName: EggName,
	isVoid: boolean,
): void {
	if (activelyWatching) {
		return;
	}

	if (autoEnabled) {
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

			tryPurchaseEgg(currenciesState, gamepassesState, petsState, worldsState, amount, eggName, isVoid);
		});

		const connection = humanoid.GetPropertyChangedSignal("MoveDirection").Connect(() => {
			activelyWatching = false;
			RunService.UnbindFromRenderStep("autoHatch");
			connection.Disconnect();
		});
	} else {
		tryPurchaseEgg(currenciesState, gamepassesState, petsState, worldsState, amount, eggName, isVoid);
	}
}
