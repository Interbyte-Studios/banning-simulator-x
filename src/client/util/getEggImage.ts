import assetIds from "shared/assets";
import { EggName, isEggName } from "shared/configs/eggs";

/**
 * @param eggName The name of the egg.
 * @returns The decal id of a specified egg image.
 */
export function getEggImage(eggName: EggName): string {
	debug.setmemorycategory("getEggImage");
	assert(isEggName(eggName), `Expected to find egg decal named "${eggName}".`);

	const decal = assetIds.images.decals.eggs[eggName as keyof typeof assetIds.images.decals.eggs];
	assert(decal, `Failed to get decal for egg "${eggName}".`);

	return decal;
}
