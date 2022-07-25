import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import {
	toggleAuto,
	toggleButtonClickSounds,
	toggleGraphics,
	toggleMusicVolume,
	togglePetAnimationType,
	togglePetsDisplayed,
	togglePetsStudsOfDistance,
	toggleSoundEffectsVolume,
	toggleTimeOfDay,
	toggleWalkSpeed,
} from "shared/rodux/settings";

const settingsRemotes = remotes.Server.GetNamespace("settings");

// [ Gameplay Remotes ] \\
const gameplayRemotes = settingsRemotes.GetNamespace("gameplay");

const toggleAutoRemote = gameplayRemotes.Create("toggleAuto");
toggleAutoRemote.Connect(withPlayerStore((_, store) => store.dispatch(toggleAuto())));

const toggleWalkSpeedRemote = gameplayRemotes.Create("toggleWalkSpeed");
toggleWalkSpeedRemote.Connect(withPlayerStore((_, store, walkSpeed) => store.dispatch(toggleWalkSpeed(walkSpeed))));

// [ Sound Remotes ] \\
const soundRemotes = settingsRemotes.GetNamespace("sound");

const toggleButtonClickRemote = soundRemotes.Create("toggleButtonClick");
toggleButtonClickRemote.Connect(
	withPlayerStore((_, store, enabled) => store.dispatch(toggleButtonClickSounds(enabled))),
);

const toggleMusicVolumeRemote = soundRemotes.Create("toggleMusicVolume");
toggleMusicVolumeRemote.Connect(withPlayerStore((_, store, volume) => store.dispatch(toggleMusicVolume(volume))));

const toggleSoundEffectsVolumeRemote = soundRemotes.Create("toggleSoundEffectsVolume");
toggleSoundEffectsVolumeRemote.Connect(
	withPlayerStore((_, store, volume) => store.dispatch(toggleSoundEffectsVolume(volume))),
);

// [ Visual Remotes ] \\
const visualRemotes = settingsRemotes.GetNamespace("visual");

const toggleGraphicsRemote = visualRemotes.Create("toggleGraphics");
toggleGraphicsRemote.Connect(withPlayerStore((_, store, quality) => store.dispatch(toggleGraphics(quality))));

const togglePetAnimationTypeRemote = visualRemotes.Create("togglePetAnimationType");
togglePetAnimationTypeRemote.Connect(
	withPlayerStore((_, store, animationType) => store.dispatch(togglePetAnimationType(animationType))),
);

const togglePetsDisplayedRemote = visualRemotes.Create("togglePetsDisplayed");
togglePetsDisplayedRemote.Connect(
	withPlayerStore((_, store, displayed) => store.dispatch(togglePetsDisplayed(displayed))),
);

const togglePetsStudsOfDistanceRemote = visualRemotes.Create("togglePetsStudsOfDistance");
togglePetsStudsOfDistanceRemote.Connect(
	withPlayerStore((_, store, studs) => store.dispatch(togglePetsStudsOfDistance(studs))),
);

const toggleTimeOfDayRemote = visualRemotes.Create("toggleTimeOfDay");
toggleTimeOfDayRemote.Connect(withPlayerStore((_, store, timeOfDay) => store.dispatch(toggleTimeOfDay(timeOfDay))));
