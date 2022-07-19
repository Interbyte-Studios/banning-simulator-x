import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { TogglePetsStudsOfDistanceDefinition } from "shared/remotes/settings/visual/togglePetsStudsOfDistance";

/**
 * Sets the studs of distance between the player and their pets.
 *
 * @param studs The distance to set.
 * @param remote The remote used to communicate the action with the server.
 */
export function setsPetsStudsOfDistance(
	studs: number,
	remote: InferClientRemote<TogglePetsStudsOfDistanceDefinition>,
): void {
	if (studs >= 20 || studs <= 10) {
		return;
	}

	remote.SendToServer(studs);
}
