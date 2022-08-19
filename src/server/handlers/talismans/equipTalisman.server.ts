import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { equipTalisman } from "server/modules/rodux/equipTalisman";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("talismans")
	.Create("equipTalisman")
	.Connect(
		withPlayerStore((_, store, talismanId) => {
			if (!store.getState().talismans.has(talismanId)) {
				return;
			}
			equipTalisman(store, talismanId);
		}),
	);
