import { remotes } from "shared/remotes";
import { toggleRarityDelete } from "shared/rodux/settings";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("settings")
	.GetNamespace("autoDelete")
	.Create("toggleAutoDelete")
	.Connect(withPlayerStore((_, store, rarity) => store.dispatch(toggleRarityDelete(rarity))));
