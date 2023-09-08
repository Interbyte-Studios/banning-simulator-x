import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { MODERATOR_RANK } from "shared/configs/admin";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("admin")
	.Get("admin_KickPlayer")
	.Connect(
		withPlayerStore((adminPlayer, store, targetPlayerId) => {
			const groupRank = store.getState().index.groupRank;
			if (groupRank < MODERATOR_RANK) {
				return;
			}

			const targetPlayer = game.GetService("Players").GetPlayerByUserId(targetPlayerId);
			if (targetPlayer === undefined) return;

			targetPlayer.Kick("You've been kicked by an Administrator.");
		}),
	);
