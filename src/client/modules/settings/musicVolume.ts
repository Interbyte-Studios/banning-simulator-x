import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleMusicVolumeDefinition } from "shared/remotes/settings/sound/toggleMusicVolume";
import { isValidVolume } from "shared/rodux/settings";

/**
 * Sets the volume of the music setting.
 *
 * @param volume The volume to set.
 * @param remote The remote used to communicate the action with the server.
 */
export function setMusicVolume(volume: number, remote: InferClientRemote<ToggleMusicVolumeDefinition>): void {
	if (!isValidVolume(volume)) {
		return;
	}

	remote.SendToServer(volume);
}
