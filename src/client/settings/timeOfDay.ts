import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleTimeOfDayDefinition } from "shared/remotes/settings/visual/toggleTimeOfDay";

/**
 * Increases or decreases the time of day.
 *
 * @param increase Whether or not to increase the time of day.
 * @param timeOfDayState The current time of day.
 * @param remote The remote used to communicate the action with the server.
 */
export function modifyTimeOfDay(
	increase: boolean,
	timeOfDayState: number,
	remote: InferClientRemote<ToggleTimeOfDayDefinition>,
): void {
	if (increase && timeOfDayState >= 24) {
		return;
	}

	if (!increase && timeOfDayState <= 0) {
		return;
	}

	const currentState = increase ? timeOfDayState + 1 : timeOfDayState - 1;
	remote.SendToServer(currentState);
}
