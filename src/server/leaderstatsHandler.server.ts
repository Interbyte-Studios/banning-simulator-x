import Make from "@rbxts/make";
import { Players } from "@rbxts/services";
import { statsAbbreviator } from "shared/util/twoDpAbbreviator";

import { onStoreCreated } from "./playerStore";

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	const eggsHatched = Make("IntValue", {
		Name: "🥚 Eggs 🥚",
		Value: store.getState().eggs.eggs,
	});
	const bans = Make("StringValue", {
		Name: "🔨 Bans 🔨",
		Value: statsAbbreviator.numberToString(store.getState().bans.bans),
	});

	// create leaderstats
	Make("Folder", {
		Name: "leaderstats",
		Parent: player,
		Children: [eggsHatched, bans],
	});

	store.changed.connect((newState, oldState) => {
		if (newState.bans.bans !== oldState.bans.bans) {
			bans.Value = statsAbbreviator.numberToString(newState.bans.bans);
		}

		if (newState.eggs.eggs !== oldState.eggs.eggs) {
			eggsHatched.Value = newState.eggs.eggs;
		}
	});
});
