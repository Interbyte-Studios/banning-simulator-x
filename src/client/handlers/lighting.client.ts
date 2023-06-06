import { GameAnalytics } from "@rbxts/gameanalytics";
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
		// do not include player names. against the rules apparently.
		GameAnalytics.addErrorEvent(Players.LocalPlayer.UserId, {
			severity: "error",
			message: `[ Lighting Handler ] - Failed to run promise callback on "onStoreCreated" | ${e}`,
		});
		throw `[ Lighting Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
	});
