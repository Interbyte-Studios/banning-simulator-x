import { Players } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import { GAME_VERSION } from "shared/configs/game";
import { logGameVersion } from "shared/rodux/playerIndex";

Players.GetPlayers().forEach((player) =>
	onStoreCreated(player).andThen((store) => {
		if (store.getState().index.gameVersion.includes(GAME_VERSION)) {
			return;
		}

		store.dispatch(logGameVersion(GAME_VERSION));
	}),
);

Players.PlayerAdded.Connect((player) =>
	onStoreCreated(player).andThen((store) => {
		if (store.getState().index.gameVersion.includes(GAME_VERSION)) {
			return;
		}

		store.dispatch(logGameVersion(GAME_VERSION));
	}),
);
