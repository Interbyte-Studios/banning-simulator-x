import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import {
	toggleAuto,
	toggleGraphics,
	toggleMusicVolume,
	togglePetAnimationType,
	togglePetsDisplayed,
	togglePetsStudsOfDistance,
	toggleTimeOfDay,
	toggleUIColor,
	toggleWalkSpeed,
} from "shared/rodux/settings";

// [ Toggle Auto Remote ]
const toggleAutoRemote = remotes.Server.GetNamespace("settings").Create("toggleAuto");

toggleAutoRemote.Connect(
	withPlayerStore((_, store) => {
		store.dispatch(toggleAuto());
	}),
);

// [ Toggle Graphics Remote ]
const toggleGraphicsRemote = remotes.Server.GetNamespace("settings").Create("toggleGraphics");
toggleGraphicsRemote.Connect(
	withPlayerStore((_, store, quality) => {
		store.dispatch(toggleGraphics(quality));
	}),
);

// [ Toggle Music Volume Remote ]
const toggleMusicVolumeRemote = remotes.Server.GetNamespace("settings").Create("toggleMusicVolume");
toggleMusicVolumeRemote.Connect(
	withPlayerStore((_, store, volume) => {
		store.dispatch(toggleMusicVolume(volume));
	}),
);

// [ Toggle Pet Animation Remote ]
const togglePetAnimationTypeRemote = remotes.Server.GetNamespace("settings").Create("togglePetAnimationType");
togglePetAnimationTypeRemote.Connect(
	withPlayerStore((_, store, animationType) => {
		store.dispatch(togglePetAnimationType(animationType));
	}),
);

// [ Toggle Pets Displayed Remote ]
const togglePetsDisplayedRemote = remotes.Server.GetNamespace("settings").Create("togglePetsDisplayed");
togglePetsDisplayedRemote.Connect(
	withPlayerStore((_, store, displayed) => {
		store.dispatch(togglePetsDisplayed(displayed));
	}),
);

// [ Toggle Pets Studs of Distance Remote ]
const togglePetsStudsOfDistanceRemote = remotes.Server.GetNamespace("settings").Create("togglePetsStudsOfDistance");
togglePetsStudsOfDistanceRemote.Connect(
	withPlayerStore((_, store, studs) => {
		store.dispatch(togglePetsStudsOfDistance(studs));
	}),
);

// [ Toggle Time of Day Remote ]
const toggleTimeOfDayRemote = remotes.Server.GetNamespace("settings").Create("toggleTimeOfDay");
toggleTimeOfDayRemote.Connect(
	withPlayerStore((_, store, _time) => {
		store.dispatch(toggleTimeOfDay(_time));
	}),
);

// [ Toggle UI Color Remote ]
const toggleUIColorRemote = remotes.Server.GetNamespace("settings").Create("toggleUIColor");
toggleUIColorRemote.Connect(
	withPlayerStore((_, store, color) => {
		store.dispatch(toggleUIColor(color));
	}),
);

// [ Toggle WalkSpeed Remote ]
const toggleWalkSpeedRemote = remotes.Server.GetNamespace("settings").Create("toggleWalkSpeed");
toggleWalkSpeedRemote.Connect(
	withPlayerStore((_, store, walkSpeed) => {
		store.dispatch(toggleWalkSpeed(walkSpeed));
	}),
);
