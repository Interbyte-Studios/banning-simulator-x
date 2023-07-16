import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { toggleRarityDelete } from "shared/rodux/settings";

remotes.Server.GetNamespace("settings")
	.GetNamespace("autoDelete")
	.Get("toggleAutoDelete")
	.Connect(withPlayerStore((_, store, rarity) => store.dispatch(toggleRarityDelete(rarity))));
