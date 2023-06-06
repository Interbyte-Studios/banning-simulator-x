import { GameAnalytics } from "@rbxts/gameanalytics";
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

			GameAnalytics.addErrorEvent(adminPlayer.UserId, {
				severity: "warning",
				message:
					targetPlayer.UserId === adminPlayer.UserId
						? `Modified talisman level self | Talisman: ${ownsTalisman.id} | Level: ${talismanData.phase}`
						: `Modified talisman level for user with id: ${targetPlayer.UserId} | Talisman: ${ownsTalisman.id} | Level: ${talismanData.phase}`,
			});
			targetPlayerStore.dispatch(admin_modifyTalismanLevel(talismanData.talismanId, talismanData.phase));
		}),
	);
