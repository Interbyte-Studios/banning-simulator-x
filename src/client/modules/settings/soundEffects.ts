import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleSoundEffectsVolumeDefinition } from "shared/remotes/settings/sound/toggleSoundEffectsVolume";
import { isValidVolume } from "shared/rodux/settings";

/**
 * Increases or decreases the volume of the sound effects setting.
 *
 * @param volume The volume to set.
 * @param remote The remote used to communicate the action with the server.
 */
export function setSoundEffects(volume: number, remote: InferClientRemote<ToggleSoundEffectsVolumeDefinition>): void {
	if (!isValidVolume(volume)) {
		return;
	}

	remote.SendToServer(volume);
}
