import { WEAPON_LEVELS } from "shared/configs/weapons";

type WeaponLevel = { level: number };

/**
 * Returns the level of a weapon.
 *
 * @param banAmount The amount of bans the weapon has contributed to.
 * @returns Level of weapon.
 */
export function getWeaponLevel(banAmount: number): WeaponLevel {
	let currentBanAmount = 0;
	let weaponLevel = 0;

	for (const weaponLevelData of WEAPON_LEVELS) {
		if (weaponLevelData.requiredBans > currentBanAmount && banAmount > weaponLevelData.requiredBans) {
			currentBanAmount = weaponLevelData.requiredBans;
			weaponLevel = weaponLevelData.level;
		}
	}

	return { level: weaponLevel };
}
