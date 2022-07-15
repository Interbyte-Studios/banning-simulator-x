import Net from "@rbxts/net";

import { toggleButtonClickDefinition } from "./toggleButtonClick";
import { toggleMasterVolumeDefinition } from "./toggleMasterVolume";
import { toggleMusicVolumeDefinition } from "./toggleMusicVolume";
import { toggleSoundEffectsVolumeDefinition } from "./toggleSoundEffectsVolume";

export const sound = Net.Definitions.Namespace({
	toggleButtonClick: toggleButtonClickDefinition,
	toggleMasterVolume: toggleMasterVolumeDefinition,
	toggleMusicVolume: toggleMusicVolumeDefinition,
	toggleSoundEffectsVolume: toggleSoundEffectsVolumeDefinition,
});
