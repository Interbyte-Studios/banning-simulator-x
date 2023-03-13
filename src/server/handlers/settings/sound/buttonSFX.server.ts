import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleButtonClickSounds } from "shared/rodux/settings";

const toggleButtonClickRemote = remotes.Server.GetNamespace("settings")
	.GetNamespace("sound")
	.Create("toggleButtonClick");
toggleButtonClickRemote.Connect(
	withPlayerStore((_, store, enabled) => store.dispatch(toggleButtonClickSounds(enabled))),
);
