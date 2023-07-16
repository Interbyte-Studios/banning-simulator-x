import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { togglePetsDisplayed } from "shared/rodux/settings";

const togglePetsDisplayedRemote = remotes.Server.GetNamespace("settings")
	.GetNamespace("visual")
	.Get("togglePetsDisplayed");
togglePetsDisplayedRemote.Connect(
	withPlayerStore((_, store, displayed) => store.dispatch(togglePetsDisplayed(displayed))),
);
