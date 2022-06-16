import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { CANDY_EGG_PETS, DESERT_EGG_PETS, HONEYCOMB_EGG_PETS, MOLTEN_EGG_PETS, Pet, STARTER_EGG_PETS } from "./pets";
import { WorldNames } from "./worlds";
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
	world: WorldNames;

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
		world: "Ban Land",
		zone: "Forest",
	},
	Desert: {
		id: 2,
		pets: DESERT_EGG_PETS,
		world: "Ban Land",
		zone: "Desert",
	},
	Honeycomb: {
		id: 3,
		pets: HONEYCOMB_EGG_PETS,
		world: "Ban Land",
		zone: "Sakura",
	},
	Candy: {
		id: 4,
		pets: CANDY_EGG_PETS,
		world: "Ban Land",
		zone: "Food Land",
	},
	Molten: {
		id: 5,
		pets: MOLTEN_EGG_PETS,
		world: "Ban Land",
		zone: "Lavalands",
	},
});

export type EggName = keyof typeof EGGS;
export type Eggs = typeof EGGS;

/**
 * How long a player must wait between egg hatches.
 */
export const hatchDebounce = 5.5;
