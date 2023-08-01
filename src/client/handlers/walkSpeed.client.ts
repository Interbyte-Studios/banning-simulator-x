debug.setmemorycategory("walkSpeed");
import { GameAnalytics } from "@rbxts/gameanalytics";
import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { getAutoFightState } from "client/modules/autoFightWalkspeedHandler";

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

	if (getAutoFightState()) {
		return;
	}

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
		// do not include player names. against the rules apparently.
		GameAnalytics.addErrorEvent(Players.LocalPlayer.UserId, {
			severity: "error",
			message: `[ WalkSpeed Handler ] - Failed to run promise callback on "onStoreCreated" | ${e}`,
		});
		throw `[ WalkSpeed Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
	});
