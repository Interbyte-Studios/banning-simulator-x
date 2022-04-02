import { ReplicatedStorage } from "@rbxts/services";
import { ValidWeapon, Weapon, WEAPONS } from "shared/configs/weapons";

import { getItemById } from "./getItemById";

/**
 * Returns the data correspondant to the id of a given weapon.
 *
 * @param weaponId The id of the weapon.
 * @returns Wepaon config data.
 */
export function getWeaponInfo(weaponId: number): Weapon {
	const weaponModel = getItemById(ReplicatedStorage.weapons, weaponId);
	assert(weaponModel, `Failed to get weapon model for weapon with id: ${tostring(weaponId)}`);

	return WEAPONS[weaponModel.Name as ValidWeapon];
}
