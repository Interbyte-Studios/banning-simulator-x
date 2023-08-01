import { getItemById } from "shared/util/getItemById";

/**
 * Toggles the state of a weapon to be equipped or unequipped.
 *
 * @param player The local player.
 * @param weaponId The ID of the weapon to equip.
 * @param isEquipped If the weapon is now equipped.
 */
export function toggleWeaponEquipped(player: Player, weaponId: number, isEquipped: boolean): void {
	debug.setmemorycategory("toggleWeaponEquippedModule");

	// equip/unequip tool
	const character = player.Character ?? player.CharacterAdded.Wait()[0];
	if (!character) {
		warn(`[ Weapon Handler ] - Failed to get Character for ${player.Name}`);
		return;
	}

	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	if (!humanoid) {
		warn(`[ Weapon Handler ] - Failed to get Humanoid for ${player.Name}`);
		return;
	}

	if (isEquipped) {
		const backpack = player.FindFirstChildWhichIsA("Backpack");
		if (backpack === undefined) {
			error(`[ Weapon Handler ] - Failed to get backpack for ${player.Name}`);
		}

		const weaponModel = getItemById(backpack, weaponId);
		if (weaponModel === undefined) {
			error(`[ Weapon Handler ] - Failed to get weapon model for ${weaponId}`);
		}

		if (!weaponModel.IsA("Tool")) {
			error(
				`[ Weapon Handler ] - Found weapon "${weaponId}", but the model was a ${weaponModel.ClassName}, not a Tool`,
			);
		}
		humanoid.EquipTool(weaponModel);
	} else {
		humanoid.UnequipTools();
	}
}
