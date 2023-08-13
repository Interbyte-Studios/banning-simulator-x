import assetIds from "shared/assets";
import { RANKS } from "shared/configs/ranks";

/**
 * @param rank The id of the rank.
 * @returns The asset id of the icon associated with the given rank.
 */
export function getRankIcon(rank: number): string {
	debug.setmemorycategory("getRankIcon");
	const rankData = RANKS.find((rankData) => rankData.id === rank);
	assert(rankData, `Failed to get data for rank of id: ${rank}`);

	const rankName = rankData.name as keyof typeof assetIds.images.ranks;
	const rankImage = assetIds.images.ranks[rankName];
	return rankImage;
}
