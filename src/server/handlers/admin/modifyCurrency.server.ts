import { GameAnalytics } from "@rbxts/gameanalytics";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { retrieveStore } from "server/playerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { remotes } from "shared/remotes";
import { awardCurrency } from "shared/rodux/currencies";

remotes.Server.GetNamespace("admin")
	.Get("admin_ModifyCurrency")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId, currency, amount) => {
			const groupRank = store.getState().index.groupRank;
			if (groupRank < ADMIN_RANK) {
				return;
			}

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			const targetPlayerStore = retrieveStore(targetPlayer);
			if (targetPlayerStore === undefined) return;

			GameAnalytics.addErrorEvent(adminPlayer.UserId, {
				severity: "warning",
				message:
					targetPlayer.UserId === adminPlayer.UserId
						? `${adminPlayer.Name} granted currency to self | Currency: ${currency} | Amount: ${amount}`
						: `${adminPlayer.Name} granted currency to user with id: ${targetPlayer.UserId} | Currency: ${currency} | Amount: ${amount}`,
			});
			targetPlayerStore.dispatch(awardCurrency(currency, amount));
		}),
	);
