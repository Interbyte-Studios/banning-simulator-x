import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleGraphics } from "shared/rodux/settings";

const toggleGraphicsRemote = remotes.Server.GetNamespace("settings").GetNamespace("visual").Create("toggleGraphics");
toggleGraphicsRemote.Connect(withPlayerStore((_, store, quality) => store.dispatch(toggleGraphics(quality))));
