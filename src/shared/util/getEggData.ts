import { Egg, EggName, EGGS } from "shared/configs/eggs";

/**
 * @param egg The name of the egg.
 * @returns The metadata of the requested egg.
 */
export function getEggData(egg: EggName): Egg {
	const eggData = EGGS[egg];
	assert(eggData, `Could not find data for egg: "${egg}"`);

	return eggData;
}
