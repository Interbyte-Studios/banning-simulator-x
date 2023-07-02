import { GameAnalytics } from "@rbxts/gameanalytics";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";

UserInputService.LastInputTypeChanged.Connect((lastInputType) => {
	if (lastInputType === Enum.UserInputType.Touch) {
		for (const instance of Workspace.GetDescendants()) {
			if (instance.IsA("BasePart")) {
				instance.CastShadow = false;
			}
		}
	}
});

const player = Players.LocalPlayer;
onStoreCreated(player)
	.andThen((store) => {
		if (store.getState().settings.visual.graphicsQuality === "Low") {
			for (const instance of Workspace.GetDescendants()) {
				if (instance.IsA("ParticleEmitter")) {
					instance.Enabled = false;
				}
			}
		}

		store.changed.connect((newState, oldState) => {
			if (newState.settings.visual.graphicsQuality === oldState.settings.visual.graphicsQuality) {
				return;
			}

			if (newState.settings.visual.graphicsQuality === "Low") {
				if (store.getState().settings.visual.graphicsQuality === "Low") {
					for (const instance of Workspace.GetDescendants()) {
						if (instance.IsA("ParticleEmitter")) {
							instance.Enabled = false;
						}
					}
				}
			} else {
				if (store.getState().settings.visual.graphicsQuality === "Low") {
					for (const instance of Workspace.GetDescendants()) {
						if (instance.IsA("ParticleEmitter")) {
							instance.Enabled = true;
						}
					}
				}
			}
		});
	})
	.catch((e) => {
		// do not include player names. against the rules apparently.
		GameAnalytics.addErrorEvent(Players.LocalPlayer.UserId, {
			severity: "error",
			message: `[ Device Performance Scaling Handler ] - Failed to run promise callback on "onStoreCreated" | ${e}`,
		});
		throw `[ Device Performance Scaling Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
	});
