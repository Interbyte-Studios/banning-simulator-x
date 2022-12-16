import { TalismanPhases, TalismanStatEffects } from "shared/configs/talismans";
import { Weapon } from "shared/rodux/weapons";

import { getTalismanData } from "./getTalismanData";

/**
 * Calculates the stat effects of a talisman.
 *
 * @param talismanId The id of the talisman.
 * @param phase The phase of the talisman.
 * @returns The stat effects of the talisman.
 */
export function getTalismanStatEffect(
	talismanId: number | undefined,
	phase: TalismanPhases | undefined,
): TalismanStatEffects {
	if (talismanId === undefined || phase === undefined) {
		return {
			damage: 0,
			experience: 1,
			walkspeed: 0,
		};
	}

	const talismanData = getTalismanData(talismanId);

	const phaseMultiplier = phase === "artifact" ? 2 : phase === "awakend" ? 1.5 : 1;
	return {
		damage: talismanData.stats.damage * phaseMultiplier,
		experience: talismanData.stats.experience * phaseMultiplier,
		walkspeed: talismanData.stats.walkspeed,
	};
}
