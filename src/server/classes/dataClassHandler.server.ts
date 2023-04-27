import { Players } from "@rbxts/services";
import { remotes } from "shared/remotes";

import { dataClass } from "./dataClass";

for (const player of Players.GetPlayers()) {
	coroutine.wrap(() => {
		warn("RUNNING REGISTRY");
		dataClass.registerPlayer(player);
	});
}

Players.PlayerAdded.Connect((player) => {
	warn("RUNNING REGISTRY");
	dataClass.registerPlayer(player);
});
Players.PlayerRemoving.Connect((player) => dataClass.removePlayerFromRegistry(player));

remotes.Server.GetNamespace("rodux")
	.Get("requestStoreState")
	.SetCallback((player) => {
		const playerStore = dataClass.retrieveStore(player);
		if (playerStore === undefined) {
			return undefined;
		}

		return {
			state: playerStore.getState(),
		};
	});
