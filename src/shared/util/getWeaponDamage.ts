import { Weapon } from "shared/rodux/weapons";

import { getWeaponInfo } from "./getWeaponInfo";

/**
 * Calculates the damage of a weapon.
 *
 * @param storedWeapon The stored weapon.
 * @returns The damage of the weapon.
 */
export function getWeaponDamage(storedWeapon: Weapon): number {
	const weaponData = getWeaponInfo(storedWeapon.id);

	const baseDamage = weaponData.data.damage;
	const additionalDamagePerLevel = weaponData.data.damage * 0.05;

	return math.floor(baseDamage + additionalDamagePerLevel * storedWeapon.level);
}
