import Net from "@rbxts/net";

import { toggleGraphicsDefinition } from "./toggleGraphics";
import { togglePetAnimationTypeDefinition } from "./togglePetAnimationType";
import { togglePetsDisplayedDefinition } from "./togglePetsDisplayed";
import { togglePetsStudsOfDistanceDefinition } from "./togglePetsStudsOfDistance";
import { toggleTimeOfDayDefinition } from "./toggleTimeOfDay";

export const visual = Net.Definitions.Namespace({
	toggleGraphics: toggleGraphicsDefinition,
	togglePetAnimationType: togglePetAnimationTypeDefinition,
	togglePetsDisplayed: togglePetsDisplayedDefinition,
	togglePetsStudsOfDistance: togglePetsStudsOfDistanceDefinition,
	toggleTimeOfDay: toggleTimeOfDayDefinition,
});
