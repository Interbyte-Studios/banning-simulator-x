import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { equipTalisman } from "client/modules/talismans/followTalisman";

const player = Players.LocalPlayer;

onStoreCreated(player)
	.andThen((store) => {
		const initialState = store.getState();

		const talismanEquipped = initialState.currentTalisman;
		if (talismanEquipped !== undefined) {
			const ownedTalisman = initialState.talismans.get(talismanEquipped);
			if (ownedTalisman !== undefined) {
				equipTalisman(player, talismanEquipped, ownedTalisman.bans);
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
