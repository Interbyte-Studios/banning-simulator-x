import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleManualFighting } from "shared/rodux/settings";

const toggleWalkSpeedRemote = remotes.Server.GetNamespace("settings")
	.GetNamespace("gameplay")
	.Get("toggleManualFighting");
toggleWalkSpeedRemote.Connect(withPlayerStore((_, store) => store.dispatch(toggleManualFighting())));
