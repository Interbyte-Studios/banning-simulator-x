import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleWalkSpeedDefinition } from "shared/remotes/settings/gameplay/toggleWalkSpeed";

/**
 * Increases or decreases the walk speed of the player according to what they're maximum walk speed is.
 *
 * @param walkSpeed The walk speed to set.
 * @param remote The remote used to communicate the action with the server.
 */
export function setWalkSpeed(walkSpeed: number, remote: InferClientRemote<ToggleWalkSpeedDefinition>): void {
	// todo: check for maximum walk speed
	if (walkSpeed <= 16) {
		return;
	}

	remote.SendToServer(walkSpeed);
}
