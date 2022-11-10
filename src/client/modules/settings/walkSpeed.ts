import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleWalkSpeedDefinition } from "shared/remotes/settings/gameplay/toggleWalkSpeed";
import { isValidWalkSpeed } from "shared/rodux/settings";
import { getTalismanData } from "shared/util/getTalismanData";

/**
 * Increases or decreases the walk speed of the player according to what they're maximum walk speed is.
 *
 * @param walkSpeed The walk speed to set.
 * @param currentTalisman The talisman the player has equipped, if any.
 * @param remote The remote used to communicate the action with the server.
 */
export function setWalkSpeed(
	walkSpeed: number,
	currentTalisman: number | undefined,
	remote: InferClientRemote<ToggleWalkSpeedDefinition>,
): void {
	if (!isValidWalkSpeed(walkSpeed)) {
		return;
	}

	if (walkSpeed < 16) {
		return;
	}

	let maxWalkSpeed = 16;
	if (currentTalisman !== undefined) {
		const talismanData = getTalismanData(currentTalisman);
		if (talismanData !== undefined) {
			maxWalkSpeed += talismanData.stats.maxSpeed;
		}
	}

	if (walkSpeed > maxWalkSpeed) {
		return;
	}

	remote.SendToServer(walkSpeed);
}
