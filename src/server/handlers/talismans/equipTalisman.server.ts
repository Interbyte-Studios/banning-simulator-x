import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { equipTalisman } from "server/modules/rodux/equipTalisman";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("talismans")
	.Create("equipTalisman")
	.Connect(
		withPlayerStore((_, store, talismanId) => {
			const storedTalisman = store.getState().talismans.find((talisman) => talisman.id === talismanId);
			if (storedTalisman === undefined) {
				return;
			}

			equipTalisman(store, talismanId);
		}),
	);
