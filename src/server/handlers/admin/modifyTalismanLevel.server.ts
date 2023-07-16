import { GameAnalytics } from "@rbxts/gameanalytics";
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

			GameAnalytics.addErrorEvent(adminPlayer.UserId, {
				severity: "warning",
				message:
					targetPlayer.UserId === adminPlayer.UserId
						? `${adminPlayer.Name} modified talisman level self | Talisman: ${ownsTalisman.id} | Level: ${talismanData.phase}`
						: `${adminPlayer.Name} modified talisman level for user with id: ${targetPlayer.UserId} | Talisman: ${ownsTalisman.id} | Level: ${talismanData.phase}`,
			});
			targetPlayerStore.dispatch(admin_modifyTalismanLevel(talismanData.talismanId, talismanData.phase));
		}),
	);
