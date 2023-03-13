import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleMusicVolume } from "shared/rodux/settings";

const toggleMusicVolumeRemote = remotes.Server.GetNamespace("settings")
	.GetNamespace("sound")
	.Create("toggleMusicVolume");
toggleMusicVolumeRemote.Connect(withPlayerStore((_, store, volume) => store.dispatch(toggleMusicVolume(volume))));
