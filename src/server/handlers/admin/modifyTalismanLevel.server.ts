import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { MODERATOR_RANK } from "shared/configs/admin";
import { remotes } from "shared/remotes";
import { admin_modifyTalismanLevel } from "shared/rodux/talismans";

remotes.Server.GetNamespace("admin")
	.Get("admin_ModifyTalismanLevel")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, talismanData) => {
			const groupRank = store.getState().index.groupRank;
			if (groupRank < MODERATOR_RANK) {
				return;
			}

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			const ownsTalisman = targetPlayerStore
				.getState()
				.talismans.find((talisman) => talisman.id === talismanData.talismanId);
			if (ownsTalisman === undefined) return;

			targetPlayerStore.dispatch(admin_modifyTalismanLevel(talismanData.talismanId, talismanData.phase));
		}),
	);
