import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { unequipTalisman } from "shared/rodux/currentTalisman";

remotes.Server.GetNamespace("talismans")
	.Create("unequipTalisman")
	.Connect(withPlayerStore((_, store) => store.dispatch(unequipTalisman())));
