import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleSoundEffectsVolumeDefinition } from "shared/remotes/settings/sound/toggleSoundEffectsVolume";

/**
 * Increases or decreases the volume of the sound effects setting.
 *
 * @param volume The volume to set.
 * @param remote The remote used to communicate the action with the server.
 */
export function setSoundEffects(volume: number, remote: InferClientRemote<ToggleSoundEffectsVolumeDefinition>): void {
	if (volume >= 10 || volume <= 0) {
		return;
	}

	remote.SendToServer(volume);
}
