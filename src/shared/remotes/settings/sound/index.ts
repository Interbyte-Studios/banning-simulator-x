import Net from "@rbxts/net";

import { toggleButtonClickDefinition } from "./toggleButtonClick";
import { toggleMusicVolumeDefinition } from "./toggleMusicVolume";
import { toggleSoundEffectsVolumeDefinition } from "./toggleSoundEffectsVolume";

export const sound = Net.Definitions.Namespace({
	toggleButtonClick: toggleButtonClickDefinition,
	toggleMusicVolume: toggleMusicVolumeDefinition,
	toggleSoundEffectsVolume: toggleSoundEffectsVolumeDefinition,
});
