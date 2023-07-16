import Object from "@rbxts/object-utils";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { equipTalisman } from "server/modules/rodux/equipTalisman";
import { TALISMANS } from "shared/configs/talismans";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("talismans")
	.Get("equipTalisman")
	.Connect(
		withPlayerStore((_, store, talismanId) => {
			const storedTalisman = store.getState().talismans.find((talisman) => talisman.id === talismanId);
			if (storedTalisman === undefined) {
				return;
			}

			const talismanData = Object.values(TALISMANS).find((talisman) => talisman.id === talismanId);
			if (talismanData === undefined) {
				return;
			}

			if (store.getState().rank < talismanData.cost.rank) {
				return;
			}

			equipTalisman(store, talismanId);
		}),
	);
