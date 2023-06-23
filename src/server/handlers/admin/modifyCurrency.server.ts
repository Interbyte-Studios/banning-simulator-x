import { GameAnalytics } from "@rbxts/gameanalytics";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { GROUP_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { awardCurrency } from "shared/rodux/currencies";

remotes.Server.GetNamespace("admin")
	.Create("admin_ModifyCurrency")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, currency, amount) => {
			const isAdminRank = adminPlayer.GetRankInGroup(GROUP_ID) >= ADMIN_RANK;
			if (!isAdminRank) return;

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			GameAnalytics.addErrorEvent(adminPlayer.UserId, {
				severity: "warning",
				message:
					targetPlayer.UserId === adminPlayer.UserId
						? `Granted currency to self | Currency: ${currency} | Amount: ${amount}`
						: `Granted currency to user with id: ${targetPlayer.UserId} | Currency: ${currency} | Amount: ${amount}`,
			});
			targetPlayerStore.dispatch(awardCurrency(currency, amount));
		}),
	);
