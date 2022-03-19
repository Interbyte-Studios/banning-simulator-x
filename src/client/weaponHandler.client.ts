import { ContextActionService, Players, StarterGui } from "@rbxts/services";
import { Store } from "shared/rodux";
import { getItemById } from "shared/util/getItemById";

import { onStoreCreated } from "./clientStores";

const player = Players.LocalPlayer;

let isEquipped = false;

/**
 * Handles the weapon controller for a Rodux store.
 *
 * @param store The players store.
 */
async function main(store: Store): Promise<void> {
	print("Retrieved store", store.getState());

	ContextActionService.BindAction(
		"weaponHandler",
		(_, state) => {
			if (state !== Enum.UserInputState.Begin) {
				return;
			}

			// toggle weapon equip weapon
			isEquipped = !isEquipped;

			// equip/unequip tool
			const character = player.Character;
			if (!character) {
				return;
			}

			const humanoid = character.FindFirstChildWhichIsA("Humanoid");
			if (!humanoid) {
				warn("attempt to equip weapon when Humanoid did not exist");
				return;
			}

			if (isEquipped) {
				const backpack = player.FindFirstChildWhichIsA("Backpack");
				assert(backpack, "No backpack existed");

				const weaponModel = getItemById(backpack, store.getState().currentWeapon);
				if (!weaponModel) {
					throw `Failed to get weapon for id "${store.getState().currentWeapon}"`;
				}
				if (!weaponModel.IsA("Tool")) {
					throw `Found weapon "${store.getState().currentWeapon}" but the model was a ${
						weaponModel.ClassName
					}, not a Tool`;
				}

				humanoid.EquipTool(weaponModel);
			} else {
				humanoid.UnequipTools();
			}
		},
		false,
		Enum.KeyCode.One,
	);
}

onStoreCreated(player)
	.andThen(main)
	.catch((e) => {
		throw `Failed to perform weaponHandler due to ${e}`;
	});

// disable Roblox default backpack
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
