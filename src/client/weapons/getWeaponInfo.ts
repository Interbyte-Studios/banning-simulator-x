import { Weapon } from "shared/configs/weapons";
import { WeaponsState } from "shared/rodux/weapons";
import { getWeaponInfo } from "shared/util/getWeaponInfo";

interface LocalWeaponInfo {
	isOwned: boolean;
	id: number;
	weaponInfo: {
		name: string;
		data: Weapon;
	};
}

/**
 * @param weaponsState The current weapon state of the players store.
 * @param id The id of the weapon.
 * @returns Local data relative to the weapon id given.
 */
export function getWeaponLocalInfo(weaponsState: WeaponsState, id: number): LocalWeaponInfo {
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const weaponInfo = getWeaponInfo(id + 1);

	return {
		weaponInfo: weaponInfo,
		id: id,
		isOwned: weaponsState.has(id),
	};
}
