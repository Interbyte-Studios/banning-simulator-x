import { GameAnalytics } from "@rbxts/gameanalytics";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { MODERATOR_RANK } from "shared/configs/admin";
import { Currency } from "shared/configs/currencies";
import { remotes } from "shared/remotes";
import { unlockRank } from "shared/rodux/rank";

remotes.Server.GetNamespace("admin")
	.Get("admin_ModifyRank")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, targetRank) => {
			const groupRank = store.getState().index.groupRank;
			if (groupRank < MODERATOR_RANK) {
				return;
			}

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			const cost = 0;
			const currency: Currency = "coins";

			GameAnalytics.addErrorEvent(adminPlayer.UserId, {
				severity: "warning",
				message:
					targetPlayer.UserId === adminPlayer.UserId
						? `${adminPlayer.Name} granted rank to self | Rank: ${targetRank}`
						: `${adminPlayer.Name} granted rank to user with id: ${targetPlayer.UserId} | Rank: ${targetRank}`,
			});
			targetPlayerStore.dispatch(unlockRank(targetRank, currency, cost));
		}),
	);
