import { Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { spinWheel } from "server/modules/rodux/spinWheel";
import { onStoreCreated } from "server/playerStore";
import { remotes } from "shared/remotes";
import { addAvailableSpins } from "shared/rodux/spinWheel";

remotes.Server.Get("spinWheel").SetCallback(withPlayerStore((_, store) => spinWheel(store)));

/**
 * Called when a player joins the game.
 *
 * @param player The player that joined.
 */
function onPlayerAdded(player: Player): void {
	task.spawn(async () => {
		const store = await onStoreCreated(player);
		// eslint-disable-next-line no-constant-condition
		while (true) {
			task.wait(1);
			if (store.getState().spinWheel.spinsAvailable > 0) {
				continue;
			}

			const now = DateTime.now().UnixTimestamp;
			const lastClaimTime = store.getState().spinWheel.lastSpinTime;
			if (now >= lastClaimTime + 86400) {
				store.dispatch(addAvailableSpins(1));
			}
		}
	});
}

for (const player of Players.GetPlayers()) {
	onPlayerAdded(player);
}
Players.PlayerAdded.Connect(onPlayerAdded);
