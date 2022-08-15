import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { talismanEquipped } from "client/modules/talismans/followTalisman";

const player = Players.LocalPlayer;

onStoreCreated(player)
	.andThen((store) => {
		talismanEquipped(player, store.getState().currentTalisman);

		store.changed.connect((newState, oldState) => {
			if (newState.currentTalisman === oldState.currentTalisman) {
				return;
			}

			talismanEquipped(player, store.getState().currentTalisman);
		});

		player.CharacterAdded.Connect(() => talismanEquipped(player, store.getState().currentTalisman));
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
