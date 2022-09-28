import assetIds from "shared/assets";
import { RANKS } from "shared/configs/ranks";
import { ValidRank } from "shared/rodux/rank";

/**
 * @param rank The id of the rank.
 * @returns The asset id of the icon associated with the given rank.
 */
export function getRankIcon(rank: number): string {
	if (!ValidRank(rank)) {
		throw `Expected rank to be between 1 and ${RANKS.size()}, got ${rank}`;
	}

	const rankImage = assetIds.images.ranks.friendly[tostring(rank) as keyof typeof assetIds.images.ranks.friendly];
	return rankImage;
}
