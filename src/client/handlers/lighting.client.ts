import { Lighting, Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";

const player = Players.LocalPlayer;

onStoreCreated(player)
	.andThen((store) => {
		Lighting.ClockTime = store.getState().settings.visual.timeOfDay;

		store.changed.connect((newState, oldState) => {
			if (newState.settings.visual.timeOfDay === oldState.settings.visual.timeOfDay) {
				return;
			}

			Lighting.ClockTime = newState.settings.visual.timeOfDay;
		});
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
