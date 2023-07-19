import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleSoundEffectsVolume } from "shared/rodux/settings";

const toggleSoundEffectsVolumeRemote = remotes.Server.GetNamespace("settings")
	.GetNamespace("sound")
	.Get("toggleSoundEffectsVolume");
toggleSoundEffectsVolumeRemote.Connect(
	withPlayerStore((_, store, volume) => store.dispatch(toggleSoundEffectsVolume(volume))),
);
