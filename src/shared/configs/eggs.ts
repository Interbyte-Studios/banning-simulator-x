import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Pet } from "./pets";
import { CANDY_EGG_PETS } from "./pets/candy";
import { DESERT_EGG_PETS } from "./pets/desert";
import { HONEYCOMB_EGG_PETS } from "./pets/honeycomb";
import { MOLTEN_EGG_PETS } from "./pets/molten";
import { STARTER_EGG_PETS } from "./pets/starter";
import { WorldName } from "./worlds";
import { ZoneNames } from "./zones";

export interface Egg {
	/**
	 * The id of the egg (for layout order).
	 */
	id: number;

	/**
	 * The pets in the egg.
	 */
	pets: Record<string, Pet>;

	/**
	 * The world the egg comes from.
	 */
	world: WorldName;

	/**
	 * The zone the egg becomes available in.
	 */
	zone: ZoneNames;
}

/**
 * All the eggs in the game.
 */
export const EGGS = preserveWithConstraint<Record<string, Egg>>()({
	Starter: {
		id: 1,
		pets: STARTER_EGG_PETS,
		world: "ban land",
		zone: "forest",
	},
	Desert: {
		id: 2,
		pets: DESERT_EGG_PETS,
		world: "ban land",
		zone: "desert",
	},
	Honeycomb: {
		id: 3,
		pets: HONEYCOMB_EGG_PETS,
		world: "ban land",
		zone: "honeycomb",
	},
	Candy: {
		id: 4,
		pets: CANDY_EGG_PETS,
		world: "ban land",
		zone: "candy land",
	},
	Molten: {
		id: 5,
		pets: MOLTEN_EGG_PETS,
		world: "ban land",
		zone: "lava lands",
	},
});

export type EggName = keyof typeof EGGS;
export type Eggs = typeof EGGS;

/**
 * Checks if an unknown value is a valid `EggName`.
 *
 * @param name The name to validate.
 * @returns If the passed `name` is a valid `EggName`.
 */
export function isEggName(name: unknown): name is EggName {
	return EGGS[name as EggName] !== undefined;
}

/**
 * How long a player must wait between egg hatches.
 */
export const hatchDebounce = 5.5;
