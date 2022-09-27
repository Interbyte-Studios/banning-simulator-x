import assetIds from "shared/assets";
import { isValidNPCRank, NPCRank } from "shared/configs/zones";

/**
 * @param rank The id of the rank.
 * @returns The asset id of the icon associated with the given rank.
 */
export function getEnemyRankIcon(rank: NPCRank): string {
	if (!isValidNPCRank(rank)) {
		throw "Expected given enemy rank to be a valid enemy rank";
	}

	const rankImage = assetIds.images.ranks.enemy.regular[rank];
	return rankImage;
}
