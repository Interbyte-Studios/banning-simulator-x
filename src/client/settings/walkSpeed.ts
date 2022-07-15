import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleWalkSpeedDefinition } from "shared/remotes/settings/gameplay/toggleWalkSpeed";

/**
 * Increases or decreases the walk speed of the player according to what they're maximum walk speed is.
 *
 * @param increase Whether or not to increase the walk speed of the player.
 * @param walkSpeedState The current state of the players walk speed.
 * @param remote The remote used to communicate the action with the server.
 */
export function modifyWalkSpeed(
	increase: boolean,
	walkSpeedState: number,
	remote: InferClientRemote<ToggleWalkSpeedDefinition>,
): void {
	// todo: check for maximum walk speed
	// check for maximum walk speed

	// check for minimum walk speed
	if (walkSpeedState <= 16) {
		return;
	}

	const currentState = increase ? walkSpeedState + 1 : walkSpeedState - 1;
	remote.SendToServer(currentState);
}
