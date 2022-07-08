import { Egg, EggName, EGGS } from "shared/configs/eggs";

/**
 * @param egg The name of the egg.
 * @returns The metadata of the requested egg.
 */
export function getEggData(egg: EggName): Egg {
	return EGGS[egg];
}
