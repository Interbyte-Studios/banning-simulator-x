import { Players } from "@rbxts/services";
import { dataClass } from "server/classes/dataClass";
import { addTimePlayed } from "shared/rodux/playerIndex";

Players.GetPlayers().forEach((player) =>
	dataClass.onStoreCreated(player).andThen((store) => {
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
	dataClass.onStoreCreated(player).andThen((store) => {
		task.defer(() => {
			// eslint-disable-next-line no-constant-condition
			while (true) {
				store.dispatch(addTimePlayed());
				task.wait(1);
			}
		});
	}),
);
