import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { TogglePetsStudsOfDistanceDefinition } from "shared/remotes/settings/visual/togglePetsStudsOfDistance";

/**
 * Increases or decreases the studs of distance between the player and their pets.
 *
 * @param increase Whether or not to increase the distance.
 * @param distanceState The current amount of studs of distance.
 * @param remote The remote used to communicate the action with the server.
 */
export function modifyPetsStudsOfDistance(
	increase: boolean,
	distanceState: number,
	remote: InferClientRemote<TogglePetsStudsOfDistanceDefinition>,
): void {
	if (increase && distanceState >= 20) {
		return;
	}

	if (!increase && distanceState <= 10) {
		return;
	}

	const currentState = increase ? distanceState + 1 : distanceState - 1;
	remote.SendToServer(currentState);
}
