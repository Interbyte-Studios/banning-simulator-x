import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { unequipTalisman } from "shared/rodux/currentTalisman";
import { toggleWalkSpeed } from "shared/rodux/settings";

remotes.Server.GetNamespace("talismans")
	.Get("unequipTalisman")
	.Connect(
		withPlayerStore((_, store) => {
			store.dispatch(toggleWalkSpeed(24));
			store.dispatch(unequipTalisman());
		}),
	);
