import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { equipTalisman } from "client/modules/talismans/followTalisman";
import { unequipTalisman } from "client/modules/talismans/unequipTalisman";

/**
 * Handles the talisman animation for the player.
 *
 * @param player The player object.
 * @returns A promise.
 */
const talismanAnimation = (player: Player): Promise<void> =>
	onStoreCreated(player).andThen((store) => {
		debug.setmemorycategory("talisman");
		task.delay(5, () => {
			const currentState = store.getState();
			if (currentState.currentTalisman !== undefined) {
				const storedTalisman = currentState.talismans.find((talisman) => talisman.id === currentState.currentTalisman);
				if (storedTalisman !== undefined) {
					equipTalisman(player, currentState.currentTalisman, storedTalisman.phase);
				}
			}
		});

		player.CharacterAdded.Connect(() => {
			task.delay(5, () => {
				const currentState = store.getState();
				if (currentState.currentTalisman !== undefined) {
					const storedTalisman = currentState.talismans.find(
						(talisman) => talisman.id === currentState.currentTalisman,
					);
					if (storedTalisman !== undefined) {
						equipTalisman(player, currentState.currentTalisman, storedTalisman.phase);
					}
				}
			});
		});

		store.changed.connect((newState, oldState) => {
			if (newState.currentTalisman !== oldState.currentTalisman) {
				if (newState.currentTalisman !== undefined) {
					const storedTalisman = newState.talismans.find((talisman) => talisman.id === newState.currentTalisman);
					if (storedTalisman !== undefined) {
						equipTalisman(player, newState.currentTalisman, storedTalisman.phase);
					}
				} else if (oldState.currentTalisman !== undefined) {
					unequipTalisman(player);
				}
			}
		});
	});

for (const player of Players.GetPlayers()) {
	talismanAnimation(player).catch((e) => {
		throw `Failed to run promise callback on "onStoreCreated" in talismanHandler for ${player.Name} | ${e}`;
	});
}

Players.PlayerAdded.Connect((player) =>
	talismanAnimation(player).catch((e) => {
		throw `Failed to run promise callback on "onStoreCreated" in talismanHandler for ${player.Name} | ${e}`;
	}),
);
Players.PlayerRemoving.Connect((player) => unequipTalisman(player));
