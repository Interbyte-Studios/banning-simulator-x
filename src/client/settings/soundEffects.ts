import { InferClientRemote } from "@rbxts/net/out/definitions/Types";
import { ToggleSoundEffectsVolumeDefinition } from "shared/remotes/settings/sound/toggleSoundEffectsVolume";

/**
 * Increases or decreases the volume of the sound effects setting.
 *
 * @param increase Whether or not to increase the volume of sound effects.
 * @param soundEffectsVolumeState The current state of the sound effects volume setting.
 * @param remote The remote used to communicate the action with the server.
 */
export function modifySoundEffects(
	increase: boolean,
	soundEffectsVolumeState: number,
	remote: InferClientRemote<ToggleSoundEffectsVolumeDefinition>,
): void {
	if (soundEffectsVolumeState >= 10) {
		return;
	}

	if (soundEffectsVolumeState <= 0) {
		return;
	}

	const currentState = increase ? soundEffectsVolumeState + 1 : soundEffectsVolumeState - 1;
	remote.SendToServer(currentState);
}
