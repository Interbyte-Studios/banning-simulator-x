import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { CANDY_EGG_PETS, DESERT_EGG_PETS, HONEYCOMB_EGG_PETS, MOLTEN_EGG_PETS, Pet, STARTER_EGG_PETS } from "./pets";
import { WORLDS } from "./worlds";

interface Egg {
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
	world: keyof typeof WORLDS;
}

/**
 * All the eggs in the game.
 */
export const EGGS = preserveWithConstraint<Record<string, Egg>>()({
	Starter: {
		id: 1,
		pets: STARTER_EGG_PETS,
		world: "Ban Land",
	},
	Desert: {
		id: 2,
		pets: DESERT_EGG_PETS,
		world: "Ban Land",
	},
	Honeycomb: {
		id: 3,
		pets: HONEYCOMB_EGG_PETS,
		world: "Ban Land",
	},
	Candy: {
		id: 4,
		pets: CANDY_EGG_PETS,
		world: "Ban Land",
	},
	Molten: {
		id: 5,
		pets: MOLTEN_EGG_PETS,
		world: "Ban Land",
	},
});
export type Eggs = typeof EGGS;
