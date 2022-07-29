import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleWalkSpeedDefinition } from "shared/remotes/settings/gameplay/toggleWalkSpeed";
import { isValidWalkSpeed } from "shared/rodux/settings";

/**
 * Increases or decreases the walk speed of the player according to what they're maximum walk speed is.
 *
 * @param walkSpeed The walk speed to set.
 * @param remote The remote used to communicate the action with the server.
 */
export function setWalkSpeed(walkSpeed: number, remote: InferClientRemote<ToggleWalkSpeedDefinition>): void {
	if (!isValidWalkSpeed(walkSpeed)) {
		return;
	}

	remote.SendToServer(walkSpeed);
}
