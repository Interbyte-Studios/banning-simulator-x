import { remotes } from "shared/remotes";
import { toggleEasyLegendariesDelete } from "shared/rodux/autoDelete";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("settings")
	.GetNamespace("autoDelete")
	.Create("toggleEasyLegendariesAutoDelete")
	.Connect(withPlayerStore((_, store) => store.dispatch(toggleEasyLegendariesDelete())));
