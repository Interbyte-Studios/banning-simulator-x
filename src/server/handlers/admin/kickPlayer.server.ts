import { GameAnalytics } from "@rbxts/gameanalytics";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { GROUP_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("admin")
	.Create("admin_KickPlayer")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId) => {
			const isAdminRank = adminPlayer.GetRankInGroup(GROUP_ID) >= ADMIN_RANK;
			if (!isAdminRank) return;

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			task.spawn(() => {
				GameAnalytics.addErrorEvent(adminPlayer.UserId, {
					severity: "warning",
					message: `Kicked ${targetPlayer.Name}`,
				});
				targetPlayer.Kick("You've been kicked by an Administrator.");
			});
		}),
	);
