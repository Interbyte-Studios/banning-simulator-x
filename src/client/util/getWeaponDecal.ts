import assetIds from "shared/assets";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

/**
 * Fetches the decal of a given weapon.
 *
 * @param weaponId The id of the weapon.
 * @returns The decal of the weapon.
 */
export function getWeaponDecal(weaponId: number): string {
	const weaponData = getWeaponInfo(weaponId);

	const image = assetIds.images.decals.weapons[weaponData.name];
	assert(image, `Failed to get decal for weapon of id: ${weaponId}`);

	return image;
}
