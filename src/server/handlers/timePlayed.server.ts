import { Players } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import { addTimePlayed } from "shared/rodux/playerIndex";

Players.GetPlayers().forEach((player) =>
	onStoreCreated(player).andThen((store) => {
		task.defer(() => {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				store.dispatch(addTimePlayed());
				task.wait(1);
			}
		});
	}),
);

Players.PlayerAdded.Connect((player) =>
	onStoreCreated(player).andThen((store) => {
		task.defer(() => {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				store.dispatch(addTimePlayed());
				task.wait(1);
			}
		});
	}),
);
