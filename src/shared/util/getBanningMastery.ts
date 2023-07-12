import { AccountMastery, BanningMastery } from "shared/configs/accountMastery";
import { BansState } from "shared/rodux/bans";

/**
 * Returns the currency multiplier provided by the player's mastery.
 *
 * @param bansState The state of the players ban data.
 * @returns The currency multiplier.
 */
export const getBanningMastery = (bansState: BansState): BanningMastery => {
	let mastery: BanningMastery | undefined = AccountMastery.banning.find((mastery) => mastery.level === 1);
	assert(mastery, `Failed to get default banning mastery. [getBanningMastery() util]`);

	for (const banningMastery of AccountMastery.banning) {
		if (bansState >= banningMastery.requiredBans) {
			if (banningMastery.level < mastery.level) {
				continue;
			}

			mastery = banningMastery;
		}
	}
	return mastery;
};
