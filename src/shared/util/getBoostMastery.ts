import { AccountMastery, BoostsMastery } from "shared/configs/accountMastery";
import { BoostsState } from "shared/rodux/boosts";

/**
 * Returns the extended boost duration multiplier provided by the player's mastery.
 *
 * @param boostsState The state of the players boost data.
 * @returns The extended boost duration multiplier.
 */
export const getBoostMastery = (boostsState: BoostsState): BoostsMastery => {
	let mastery: BoostsMastery | undefined = AccountMastery.boosts.find((mastery) => mastery.level === 1);
	assert(mastery, `Failed to get default boos mastery. [getBoostMastery() util]`);

	for (const boostMastery of AccountMastery.boosts) {
		if (boostsState.uses >= boostMastery.requiredUses) {
			if (boostMastery.level < mastery.level) {
				continue;
			}

			mastery = boostMastery;
		}
	}
	return mastery;
};
