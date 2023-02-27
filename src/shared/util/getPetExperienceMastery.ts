import { AccountMastery, RankMastery } from "shared/configs/accountMastery";
import { PlayerIndexState } from "shared/rodux/playerIndex";

/**
 * Returns the pet experience multiplier provided by the player's mastery.
 *
 * @param indexState The state of the players index.
 * @returns The pet experience multiplier.
 */
export const getPetExperienceMastery = (indexState: PlayerIndexState): RankMastery => {
	let totalMaxLevelPetsEarned = 0;
	for (const [, petMastery] of pairs(indexState.pets)) {
		totalMaxLevelPetsEarned += petMastery.maxLevel.regular;
		totalMaxLevelPetsEarned += petMastery.maxLevel.void;
		totalMaxLevelPetsEarned += petMastery.maxLevel.radiant;
	}

	let mastery: RankMastery | undefined = AccountMastery.rank.find((mastery) => mastery.level === 1);
	assert(mastery, `Failed to get default egg mastery. [getEggsMastery() util]`);

	for (const rankMastery of AccountMastery.rank) {
		if (totalMaxLevelPetsEarned >= rankMastery.maxLevelPets) {
			if (rankMastery.level < mastery.level) {
				continue;
			}

			mastery = rankMastery;
		}
	}
	return mastery;
};
