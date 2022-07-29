import { getItemById } from "shared/util/getItemById";

/**
 * Toggles the state of a weapon to be equipped or unequipped.
 *
 * @param player The local player.
 * @param weaponId The ID of the weapon to equip.
 * @param isEquipped If the weapon is now equipped.
 */
export function toggleWeaponEquipped(player: Player, weaponId: number, isEquipped: boolean): void {
	// equip/unequip tool
	const character = player.Character;
	if (!character) {
		return;
	}

	const humanoid = character.FindFirstChildWhichIsA("Humanoid");
	if (!humanoid) {
		warn("attempt to equip weapon when Humanoid did not exist");
		return;
	}

	if (isEquipped) {
		const backpack = player.FindFirstChildWhichIsA("Backpack");
		assert(backpack, "No backpack existed");

		const weaponModel = getItemById(backpack, weaponId);
		assert(weaponModel, `Failed to get weapon for id "${weaponId}"`);
		assert(
			weaponModel.IsA("Tool"),
			`Found weapon "${weaponId}", but the model was a ${weaponModel.ClassName}, not a Tool`,
		);

		humanoid.EquipTool(weaponModel);
	} else {
		humanoid.UnequipTools();
	}
}
