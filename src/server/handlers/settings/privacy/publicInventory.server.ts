import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { togglePublicInventory } from "shared/rodux/settings";

const togglePublicInventoryRemote = remotes.Server.GetNamespace("settings")
	.GetNamespace("privacy")
	.Create("publicInventory");
togglePublicInventoryRemote.Connect(withPlayerStore((_, store) => store.dispatch(togglePublicInventory())));
