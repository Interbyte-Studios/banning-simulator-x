import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleEasyLegendariesDelete } from "shared/rodux/settings";

remotes.Server.GetNamespace("settings")
	.GetNamespace("autoDelete")
	.Create("toggleEasyLegendariesAutoDelete")
	.Connect(withPlayerStore((_, store) => store.dispatch(toggleEasyLegendariesDelete())));
