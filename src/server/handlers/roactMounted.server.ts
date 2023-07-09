import Make from "@rbxts/make";
import { remotes } from "shared/remotes";

remotes.Server.GetNamespace("playerLoaded")
	.Get("roactMounted")
	.Connect((player) => {
		if (player.FindFirstChild("RoactMounted")) {
			return;
		}

		Make("BoolValue", {
			Name: "RoactMounted",
			Parent: player,
			Value: true,
		});
	});

remotes.Server.GetNamespace("playerLoaded")
	.Get("hasClickedPlay")
	.Connect((player) => {
		if (player.FindFirstChild("HasClickedPlay")) {
			return;
		}

		Make("BoolValue", {
			Name: "HasClickedPlay",
			Parent: player,
			Value: true,
		});
	});
