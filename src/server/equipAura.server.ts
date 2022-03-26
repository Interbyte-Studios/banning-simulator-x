import { Players, ReplicatedStorage } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { Store } from "shared/rodux";
import { getItemById } from "shared/util/getItemById";
import { validateCharacter } from "shared/util/validateCharacter";

import { withPlayerStore } from "./modules/net/withPlayerStore";
import { equipAura } from "./modules/rodux/equipAura";
import { onStoreCreated } from "./playerStore";

remotes.Server.Create("equipAura").Connect(withPlayerStore((_, store, auraId) => equipAura(store, auraId)));

/**
 * Creates and parents the aura model to the player's humanoid root part.
 *
 * @param store The rodux store associated with the player.
 * @param player The player object.
 * @returns Output warnings if there are issues.
 */
function characterAdded(store: Store, player: Player): void {
	// validate character
	const character = player.Character;
	if (character === undefined) {
		return warn(`Failed to get Character for ${player.Name}`);
	}

	const humanoid = character.FindFirstChildWhichIsA("Humanoid");
	if (humanoid === undefined) {
		return warn(`Failed to get Humanoid for ${player.Name}`);
	}

	const humanoidRootPart = humanoid.RootPart;
	if (humanoidRootPart === undefined) {
		return warn(`Failed to get HumanoidRootPart for ${player.Name}`);
	}

	// create aura
	const auraModel = getItemById(ReplicatedStorage.auras, store.getState().currentAura);
	assert(auraModel, `Failed to get aura with id "${store.getState().currentAura}"`);

	auraModel.Parent = humanoidRootPart;
}

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	// Handle Character
	if (player.Character) {
		characterAdded(store, player);
	}

	player.CharacterAdded.Connect(() => characterAdded(store, player));

	// listen to store weapon changes and apply them
	store.changed.connect((newState, oldState) => {
		if (newState.currentAura === oldState.currentAura) {
			return;
		}

		// validate character
		const character = player.Character;
		if (character === undefined) {
			return warn(`Failed to get Character for ${player.Name}`);
		}

		const humanoid = character.FindFirstChildWhichIsA("Humanoid");
		if (humanoid === undefined) {
			return warn(`Failed to get Humanoid for ${player.Name}`);
		}

		const humanoidRootPart = humanoid.RootPart;
		if (humanoidRootPart === undefined) {
			return warn(`Failed to get HumanoidRootPart for ${player.Name}`);
		}

		// remove old aura
		const oldAuraModel = getItemById(ReplicatedStorage.auras, oldState.currentAura);
		assert(oldAuraModel, `Failed to get aura with id "${oldState.currentAura}"`);

		const oldAura = humanoidRootPart.FindFirstChild(oldAuraModel.Name);
		if (oldAura !== undefined) {
			oldAura.Parent = undefined;
		}

		// create aura
		const newAuraModel = getItemById(ReplicatedStorage.auras, newState.currentAura);
		assert(newAuraModel, `Failed to get aura with id "${newState.currentAura}"`);

		newAuraModel.Parent = humanoidRootPart;
	});
});
