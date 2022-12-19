import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { equipTalisman } from "client/modules/talismans/followTalisman";
import { unequipTalisman } from "client/modules/talismans/unequipTalisman";
import { Store } from "shared/rodux";

/**
 * Checks to see if the player should have a talisman equipped.
 *
 * @param player The player object.
 * @param store The player's store.
 */
function checkTalismanEquip(player: Player, store: Store): void {
	const currentState = store.getState();

	const equippedTalisman = currentState.currentTalisman;
	if (equippedTalisman === undefined) {
		return;
	}

	const storedTalisman = currentState.talismans.find((talisman) => talisman.id === equippedTalisman);
	if (storedTalisman === undefined) {
		return;
	}

	equipTalisman(player, equippedTalisman, storedTalisman.phase);
}

/**
 * Handles the equipping and unequipping of talisman objects for players.
 *
 * @param player The player object.
 */
function handlePlayerTalisman(player: Player): void {
	onStoreCreated(player)
		.andThen((store) => {
			checkTalismanEquip(player, store);

			player.CharacterAdded.Connect(() => checkTalismanEquip(player, store));

			store.changed.connect((newState, oldState) => {
				if (newState.currentTalisman === oldState.currentTalisman) {
					if (newState.currentTalisman === undefined || oldState.currentTalisman === undefined) {
						return;
					}

					const storedTalisman = newState.talismans.find((talisman) => talisman.id === newState.currentTalisman);
					const oldStoredTalisman = oldState.talismans.find((talisman) => talisman.id === oldState.currentTalisman);

					if (storedTalisman === undefined || oldStoredTalisman === undefined) {
						return;
					}

					if (storedTalisman.phase === oldStoredTalisman.phase) {
						return;
					}

					checkTalismanEquip(player, store);
				}

				const currentTalisman = newState.currentTalisman;
				if (currentTalisman !== undefined) {
					checkTalismanEquip(player, store);
				} else {
					unequipTalisman(player);
				}
			});
		})
		.catch((e) => {
			throw `Failed to get store for player ${player.Name} | ${e}`;
		});
}

Players.GetPlayers().forEach((player) => handlePlayerTalisman(player));
Players.PlayerAdded.Connect((player) => handlePlayerTalisman(player));
