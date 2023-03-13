import { Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { GROUP_ID } from "shared/configs/game";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("admin")
	.Create("admin_ShutdownServer")
	.Connect(
		withPlayerStore((adminPlayer) => {
			const isAdminRank = adminPlayer.GetRankInGroup(GROUP_ID) >= ADMIN_RANK;
			if (!isAdminRank) return;

			task.spawn(() => {
				// eslint-disable-next-line no-constant-condition
				while (true) {
					task.wait(0.5);
					Players.GetPlayers().forEach((player) => {
						player.Kick("An Administrator has shut down the server.");
					});
				}
			});
		}),
	);
