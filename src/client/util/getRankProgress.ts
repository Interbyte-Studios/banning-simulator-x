import { RANKS } from "shared/configs/ranks";

/**
 * @param currentRank The current rank of the player.
 * @param experience The experience of the player.
 * @returns The progress of the player towards the next rank in increments of 1-5.
 */
export function getRankProgress(currentRank: number, experience: number): 1 | 2 | 3 | 4 | 5 {
	debug.setmemorycategory("getRankProgress");
	const nextRankData = RANKS[currentRank];
	if (nextRankData === undefined) {
		if (currentRank === RANKS.size()) {
			return 5;
		}

		throw `Expected to find rank data for rank ${currentRank}, but it was not found.`;
	}

	const progress = experience / nextRankData.requiredExperience;
	return progress >= 1
		? 5
		: (math.floor(progress * 5) as 1 | 2 | 3 | 4 | 5) <= 0
		? 1
		: (math.floor(progress * 5) as 1 | 2 | 3 | 4 | 5);
}
