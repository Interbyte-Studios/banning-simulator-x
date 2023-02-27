import { AccountMastery, EggsMastery } from "shared/configs/accountMastery";
import { EggsState } from "shared/rodux/eggs";

/**
 * Returns the reduced egg cost multiplier provided by the player's mastery.
 *
 * @param eggsState The state of the players egg data.
 * @returns The reduced egg cost multiplier.
 */
export const getEggsMastery = (eggsState: EggsState): EggsMastery => {
	let mastery: EggsMastery | undefined = AccountMastery.eggs.find((mastery) => mastery.level === 1);
	assert(mastery, `Failed to get default egg mastery. [getEggsMastery() util]`);

	for (const eggMastery of AccountMastery.eggs) {
		if (eggsState.eggs >= eggMastery.requiredHatches) {
			if (eggMastery.level < mastery.level) {
				continue;
			}

			mastery = eggMastery;
		}
	}
	return mastery;
};
