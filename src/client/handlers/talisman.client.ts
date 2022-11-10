import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { equipTalisman } from "client/modules/talismans/followTalisman";

const player = Players.LocalPlayer;

onStoreCreated(player)
	.andThen((store) => {
		const initialState = store.getState();

		const talismanEquipped = initialState.currentTalisman;
		if (talismanEquipped !== undefined) {
			print(initialState.currentTalisman);
			const ownedTalisman = initialState.talismans.get(talismanEquipped);
			print(initialState.talismans);
			if (ownedTalisman !== undefined) {
				equipTalisman(player, talismanEquipped, ownedTalisman.bans);
				warn("attempting to equip");
			}
		}

		player.CharacterAdded.Connect(() => {
			const currentState = store.getState();

			const talismanEquipped = currentState.currentTalisman;
			if (talismanEquipped === undefined) {
				return;
			}

			const ownedTalisman = currentState.talismans.get(talismanEquipped);
			if (ownedTalisman === undefined) {
				return;
			}

			equipTalisman(player, talismanEquipped, ownedTalisman.bans);
		});

		store.changed.connect((newState) => {
			const talismanEquipped = newState.currentTalisman;
			if (talismanEquipped === undefined) {
				return;
			}

			const ownedTalisman = newState.talismans.get(talismanEquipped);
			if (ownedTalisman === undefined) {
				return;
			}

			equipTalisman(player, talismanEquipped, ownedTalisman.bans);
		});
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
