import Net from "@rbxts/net";

import { toggleAutoHatchDefinition } from "../settings/toggleAuto";
import { toggleGraphicsDefinition } from "./toggleGraphics";
import { toggleMusicVolumeDefinition } from "./toggleMusicVolume";
import { togglePetAnimationTypeDefinition } from "./togglePetAnimationType";
import { togglePetsDisplayedDefinition } from "./togglePetsDisplayed";
import { togglePetsStudsOfDistanceDefinition } from "./togglePetsStudsOfDistance";
import { toggleTimeOfDayDefinition } from "./toggleTimeOfDay";
import { toggleUIColorDefinition } from "./toggleUIColor";
import { toggleWalkSpeedDefinition } from "./toggleWalkSpeed";

export const settings = Net.Definitions.Namespace({
	toggleAuto: toggleAutoHatchDefinition,
	toggleGraphics: toggleGraphicsDefinition,
	toggleMusicVolume: toggleMusicVolumeDefinition,
	togglePetAnimationType: togglePetAnimationTypeDefinition,
	togglePetsDisplayed: togglePetsDisplayedDefinition,
	togglePetsStudsOfDistance: togglePetsStudsOfDistanceDefinition,
	toggleTimeOfDay: toggleTimeOfDayDefinition,
	toggleUIColor: toggleUIColorDefinition,
	toggleWalkSpeed: toggleWalkSpeedDefinition,
});
