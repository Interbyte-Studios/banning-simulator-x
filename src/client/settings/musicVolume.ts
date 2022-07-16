import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleMusicVolumeDefinition } from "shared/remotes/settings/sound/toggleMusicVolume";

/**
 * Increases or decreases the volume of the music setting.
 *
 * @param increase Whether or not to increase the volume of music.
 * @param musicVolumeState The current state of the music volume setting.
 * @param remote The remote used to communicate the action with the server.
 */
export function modifyMusicVolume(
	increase: boolean,
	musicVolumeState: number,
	remote: InferClientRemote<ToggleMusicVolumeDefinition>,
): void {
	warn("music called");
	if (musicVolumeState >= 10) {
		return;
	}

	if (musicVolumeState <= 0) {
		return;
	}

	const currentState = increase ? musicVolumeState + 1 : musicVolumeState - 1;
	remote.SendToServer(currentState);
	warn("music sent");
}
