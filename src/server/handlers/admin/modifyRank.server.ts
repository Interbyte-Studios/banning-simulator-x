import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { Currency } from "shared/configs/currencies";
import { GROUP_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { unlockRank } from "shared/rodux/rank";

remotes.Server.GetNamespace("admin")
	.Create("admin_ModifyRank")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, targetRank) => {
			const isAdminRank = adminPlayer.GetRankInGroup(GROUP_ID) >= ADMIN_RANK;
			if (!isAdminRank) return;

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			const cost = 0;
			const currency: Currency = "coins";

			targetPlayerStore.dispatch(unlockRank(targetRank, currency, cost));
		}),
	);
