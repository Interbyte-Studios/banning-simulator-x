import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { equipTalisman } from "client/modules/talismans/followTalisman";
import { unequipTalisman } from "client/modules/talismans/unequipTalisman";

const player = Players.LocalPlayer;

onStoreCreated(player)
	.andThen((store) => {
		const initialState = store.getState();

		const talismanEquipped = initialState.currentTalisman;
		if (talismanEquipped !== undefined) {
			const ownedTalisman = initialState.talismans.get(talismanEquipped);
			if (ownedTalisman !== undefined) {
				equipTalisman(player, talismanEquipped, ownedTalisman.phase);
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

			equipTalisman(player, talismanEquipped, ownedTalisman.phase);
		});

		store.changed.connect((newState, oldState) => {
			if (newState.currentTalisman === oldState.currentTalisman) {
				if (newState.currentTalisman === undefined || oldState.currentTalisman === undefined) {
					return;
				}

				const storedTalisman = newState.talismans.get(newState.currentTalisman);
				const oldStoredTalisman = oldState.talismans.get(oldState.currentTalisman);

				if (storedTalisman === undefined || oldStoredTalisman === undefined) {
					return;
				}

				if (storedTalisman.phase === oldStoredTalisman.phase) {
					return;
				}

				equipTalisman(player, newState.currentTalisman, storedTalisman.phase);
			}

			const currentTalisman = newState.currentTalisman;
			if (currentTalisman !== undefined) {
				const ownedTalisman = newState.talismans.get(currentTalisman);
				if (ownedTalisman === undefined) {
					return;
				}

				equipTalisman(player, currentTalisman, ownedTalisman.phase);
				return;
			}

			if (currentTalisman === undefined) {
				unequipTalisman(player);
				return;
			}
		});
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
