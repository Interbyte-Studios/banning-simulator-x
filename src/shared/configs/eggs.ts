import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Pet } from "./pets";
import { ARMORED_EGG_PETS } from "./pets/armored";
import { CANDY_EGG_PETS } from "./pets/candy";
import { CITY_EGG_PETS } from "./pets/city";
import { CORRUPT_EGG_PETS } from "./pets/corrupt";
import { CYBER_EGG_PETS } from "./pets/cyber";
import { DESERT_EGG_PETS } from "./pets/desert";
import { HONEYCOMB_EGG_PETS } from "./pets/honeycomb";
import { MOLTEN_EGG_PETS } from "./pets/molten";
import { ROYALTY_EGG_PETS } from "./pets/royalty";
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
	world: WorldName | "Limited";

	/**
	 * The zone the egg becomes available in.
	 */
	zone: ZoneNames | "Limited";

	/**
	 * Whether or not the egg is hatchable.
	 */
	hatchable: boolean;
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
		hatchable: true,
	},
	Desert: {
		id: 2,
		pets: DESERT_EGG_PETS,
		world: "Ban Land",
		zone: "Desert",
		hatchable: true,
	},
	Honeycomb: {
		id: 3,
		pets: HONEYCOMB_EGG_PETS,
		world: "Ban Land",
		zone: "Honeycomb",
		hatchable: true,
	},
	Candy: {
		id: 4,
		pets: CANDY_EGG_PETS,
		world: "Ban Land",
		zone: "Candy Land",
		hatchable: true,
	},
	Molten: {
		id: 5,
		pets: MOLTEN_EGG_PETS,
		world: "Ban Land",
		zone: "Lava Lands",
		hatchable: true,
	},
	Royalty: {
		id: 6,
		pets: ROYALTY_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
	},
	City: {
		id: 7,
		pets: CITY_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
	},
	Cyber: {
		id: 8,
		pets: CYBER_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
	},
	Corrupt: {
		id: 9,
		pets: CORRUPT_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
	},
	Armored: {
		id: 10,
		pets: ARMORED_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
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
