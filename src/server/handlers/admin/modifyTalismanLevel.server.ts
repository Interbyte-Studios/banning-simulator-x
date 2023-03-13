import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { GROUP_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { admin_modifyTalismanLevel } from "shared/rodux/talismans";

remotes.Server.GetNamespace("admin")
	.Create("admin_ModifyTalismanLevel")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, talismanData) => {
			const isAdminRank = adminPlayer.GetRankInGroup(GROUP_ID) >= ADMIN_RANK;
			if (!isAdminRank) return;

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
