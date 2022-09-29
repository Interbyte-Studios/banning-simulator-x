import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";

const player = Players.LocalPlayer;

/**
 * Modifies the local player's WalkSpeed.
 *
 * @param walkSpeed The amount of WalkSpeed the player has.
 */
function changeWalkSpeed(walkSpeed: number): void {
	const character = player.Character;
	assert(character, `Failed to get Character for ${player.Name}`);

	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	assert(humanoid, `Failed to get Humanoid for ${player.Name}`);

	humanoid.WalkSpeed = walkSpeed;
}

onStoreCreated(player)
	.andThen((store) => {
		if (player.Character) {
			changeWalkSpeed(store.getState().settings.gameplay.walkSpeed);
		}

		player.CharacterAdded.Connect(() => {
			changeWalkSpeed(store.getState().settings.gameplay.walkSpeed);
		});

		store.changed.connect((newState, oldState) => {
			if (newState.settings.gameplay.walkSpeed === oldState.settings.gameplay.walkSpeed) {
				return;
			}

			if (player.Character) {
				changeWalkSpeed(store.getState().settings.gameplay.walkSpeed);
			}
		});
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
