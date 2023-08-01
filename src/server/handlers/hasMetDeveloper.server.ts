import { Players } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import { setHasMetDeveloper } from "shared/rodux/playerIndex/hasMetDeveloper";

/**
 * Called when a player joins the server.
 *
 * @param player The player that has joined the server.
 */
function playerAdded(player: Player): void {
	if (player.UserId === 8022155 || player.UserId === 87520897 || player.UserId === 94560168) {
		for (const oPlayer of Players.GetPlayers()) {
			task.spawn(async () => {
				debug.setmemorycategory("hasMetDeveloper");
				const store = await onStoreCreated(oPlayer);
				if (!store.getState().index.hasMetDeveloper) {
					store.dispatch(setHasMetDeveloper());
				}
			});
		}
	}
}

Players.GetPlayers().forEach(playerAdded);
Players.PlayerAdded.Connect(playerAdded);
