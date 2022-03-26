import { Players, ReplicatedStorage } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { getItemById } from "shared/util/getItemById";

import { withPlayerStore } from "./modules/net/withPlayerStore";
import { equipAura } from "./modules/rodux/equipAura";
import { onStoreCreated } from "./playerStore";

remotes.Server.Create("equipAura").Connect(withPlayerStore((_, store, auraId) => equipAura(store, auraId)));

/**
 * Creates and parents the aura model to the player's humanoid root part.
 *
 * @param character The character model.
 * @param auraId The id of the aura to clone and parent to the player's character.
 */
function parentAuraToCharacter(character: Model, auraId: number): void {
	// validate character
	assert(character, `Failed to get character, could not create aura.`);
	const humanoidRootPart = character.FindFirstChildWhichIsA("Humanoid")?.RootPart;

	// create aura
	const auraModel = getItemById(ReplicatedStorage.auras, auraId);
	assert(auraModel, `Failed to get aura with id "${auraId}"`);

	auraModel.Parent = humanoidRootPart;
}

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	// handle character
	if (player.Character) {
		parentAuraToCharacter(player.Character, store.getState().currentAura);
	}

	player.CharacterAdded.Connect((character) => parentAuraToCharacter(character, store.getState().currentAura));

	// listen to store aura changes and apply them
	store.changed.connect((newState, oldState) => {
		if (newState.currentAura === oldState.currentAura) {
			return;
		}

		// validate character
		assert(player.Character, `Failed to get character for ${player.Name}`);

		const humanoidRootPart = player.Character.FindFirstChildWhichIsA("Humanoid")?.RootPart;
		if (humanoidRootPart) {
			// remove old aura
			const oldAuraModel = getItemById(ReplicatedStorage.auras, oldState.currentAura);
			assert(oldAuraModel, `Failed to get aura with id "${oldState.currentAura}"`);

			const oldAura = humanoidRootPart.FindFirstChild(oldAuraModel.Name);
			if (oldAura !== undefined) {
				oldAura.Parent = undefined;
			}
		}

		// create aura
		parentAuraToCharacter(player.Character, newState.currentAura);
	});
});
