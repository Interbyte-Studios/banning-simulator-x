import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { equipTalisman } from "client/modules/talismans/followTalisman";

const player = Players.LocalPlayer;

onStoreCreated(player)
	.andThen((store) => {
		equipTalisman(player, store.getState().currentTalisman);

		store.changed.connect((newState, oldState) => {
			if (newState.currentTalisman === oldState.currentTalisman) {
				return;
			}

			equipTalisman(player, store.getState().currentTalisman);
		});

		player.CharacterAdded.Connect(() => equipTalisman(player, store.getState().currentTalisman));
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
