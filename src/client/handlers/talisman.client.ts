import { GameAnalytics } from "@rbxts/gameanalytics";
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
			/**
			 * Handles the talisman for the player.
			 */
			const handleTalisman = (): void => {
				const character = player.Character ?? player.CharacterAdded.Wait()[0];
				if (character === undefined) {
					warn(`[Talisman Handler] - Failed to get character for player ${player.Name} ${player.UserId}`);
					return;
				}

				const humanoid = character.WaitForChild("Humanoid") as Humanoid;
				if (humanoid === undefined) {
					warn(`[Talisman Handler] - Failed to get humanoid for player ${player.Name} ${player.UserId}`);
					return;
				}

				const humanoidRootPart = humanoid.RootPart;
				if (humanoidRootPart === undefined) {
					warn(`[Talisman Handler] - Failed to get humanoid root part for player ${player.Name} ${player.UserId}`);
					return;
				}

				checkTalismanEquip(player, store);
			};

			task.delay(5, (): void => {
				handleTalisman();
				player.CharacterAdded.Connect(() => task.delay(2, () => handleTalisman()));

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

						handleTalisman();
					}

					const currentTalisman = newState.currentTalisman;
					if (currentTalisman !== undefined) {
						handleTalisman();
					} else {
						unequipTalisman(player);
					}
				});
			});
		})
		.catch((e) => {
			// do not include player names. against the rules apparently.
			GameAnalytics.addErrorEvent(Players.LocalPlayer.UserId, {
				severity: "error",
				message: `[ Talisman Handler ] - Failed to run promise callback on "onStoreCreated" | ${e}`,
			});
			throw `[ Talisman Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
		});
}

Players.GetPlayers().forEach((player) => handlePlayerTalisman(player));
Players.PlayerAdded.Connect((player) => handlePlayerTalisman(player));
Players.PlayerRemoving.Connect((player) => unequipTalisman(player));
