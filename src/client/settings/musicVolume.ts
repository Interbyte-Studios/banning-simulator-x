import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleMusicVolumeDefinition } from "shared/remotes/settings/sound/toggleMusicVolume";

/**
 * Sets the volume of the music setting.
 *
 * @param volume The volume to set.
 * @param remote The remote used to communicate the action with the server.
 */
export function setMusicVolume(volume: number, remote: InferClientRemote<ToggleMusicVolumeDefinition>): void {
	if (volume >= 10 || volume <= 0) {
		return;
	}

	remote.SendToServer(volume);
}
