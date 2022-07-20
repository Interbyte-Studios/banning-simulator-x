import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleTimeOfDayDefinition } from "shared/remotes/settings/visual/toggleTimeOfDay";
import { isValidTimeOfDay } from "shared/rodux/settings";

/**
 * Increases or decreases the time of day.
 *
 * @param timeOfDay The time to set.
 * @param remote The remote used to communicate the action with the server.
 */
export function setTimeOfDay(timeOfDay: number, remote: InferClientRemote<ToggleTimeOfDayDefinition>): void {
	if (!isValidTimeOfDay) {
		return;
	}

	remote.SendToServer(timeOfDay);
}
