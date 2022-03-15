import { ContextActionService, Players, ReplicatedStorage } from "@rbxts/services";
import { Store } from "shared/rodux";
import { getItemById } from "shared/util/getItemById";

import { onStoreCreated } from "./clientStores";
import { equipWeapon } from "./weapons/equipWeapon";

const player = Players.LocalPlayer;

let isEquipped = false;

/**
 * Handles the weapon controller for a Rodux store.
 *
 * @param store The players store.
 */
async function main(store: Store): Promise<void> {
	print("Retrieved store", store);

	ContextActionService.BindAction(
		"weaponHandler",
		(_, state) => {
			if (state !== Enum.UserInputState.Begin) {
				return;
			}

			// toggle weapon equip weapon
			isEquipped = !isEquipped;
			const character = player.Character;
			if (character) {
				const weaponModel = getItemById(ReplicatedStorage.weapons, store.getState().currentWeapon);
				if (!weaponModel) {
					throw `Failed to get weapon for id "${store.getState().currentWeapon}"`;
				}
				if (!weaponModel.IsA("Model")) {
					throw `Found weapon "${store.getState().currentWeapon}" but the model was a ${
						weaponModel.ClassName
					}, not a model`;
				}

				if (isEquipped) {
					equipWeapon(character, weaponModel.Clone());
				} else {
					// unequip weapon
				}
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
