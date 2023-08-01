import assetIds from "shared/assets";
import { WorldName } from "shared/configs/worlds";

/**
 * Fetches the decal of a specified world.
 *
 * @param name The name of the world.
 * @returns The decal of the world.
 */
export function getWorldImage(name: WorldName): string {
	debug.setmemorycategory("getWorldImage");
	const image = assetIds.images.decals.worlds[name];
	return image;
}
