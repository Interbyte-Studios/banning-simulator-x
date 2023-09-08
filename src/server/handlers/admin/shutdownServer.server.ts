import { Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { ADMIN_RANK } from "shared/configs/admin";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("admin")
	.Get("admin_ShutdownServer")
	.Connect(
		withPlayerStore((_, store) => {
			const groupRank = store.getState().index.groupRank;
			if (groupRank < ADMIN_RANK) {
				return;
			}

			// eslint-disable-next-line no-constant-condition
			while (true) {
				task.wait(0.5);
				Players.GetPlayers().forEach((player) => {
					player.Kick("An Administrator has shut down the server.");
				});
			}
		}),
	);
