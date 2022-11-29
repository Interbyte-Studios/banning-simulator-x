import { Workspace } from "@rbxts/services";

/**
 * Removes a talisman from client objects.
 *
 * @param player The player the talisman belongs to.
 */
export function unequipTalisman(player: Player): void {
	const talisman = Workspace["client objects"].talismans.FindFirstChild(player.Name);
	if (talisman === undefined) {
		return;
	}

	talisman.Destroy();
}
