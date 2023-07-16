import assetIds from "shared/assets";
import { EggName, isEggName } from "shared/configs/eggs";

/**
 * @param eggName The name of the egg.
 * @returns The decal id of a specified egg image.
 */
export function getEggImage(eggName: EggName): string {
	assert(isEggName(eggName), `Expected to find egg decal named "${eggName}".`);

	if (eggName === "500k Event") {
		return assetIds.images.decals.eggs["Angelic Egg"];
	}

	const decal = assetIds.images.decals.eggs[eggName as keyof typeof assetIds.images.decals.eggs];
	assert(decal, `Failed to get decal for egg "${eggName}".`);

	return decal;
}
