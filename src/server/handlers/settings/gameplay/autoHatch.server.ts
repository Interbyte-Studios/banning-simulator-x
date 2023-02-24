import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleAuto } from "shared/rodux/settings";

const toggleAutoRemote = remotes.Server.GetNamespace("settings").GetNamespace("gameplay").Create("toggleAuto");
toggleAutoRemote.Connect(withPlayerStore((_, store) => store.dispatch(toggleAuto())));
