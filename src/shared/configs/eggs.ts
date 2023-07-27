import { t } from "@rbxts/t";

import { Pet } from "./pets";
import { ARMORED_EGG_PETS } from "./pets/armored";
import { CANDY_EGG_PETS } from "./pets/candy";
import { CITY_EGG_PETS } from "./pets/city";
import { CORRUPT_EGG_PETS } from "./pets/corrupt";
import { CYBER_EGG_PETS } from "./pets/cyber";
import { DESERT_EGG_PETS } from "./pets/desert";
import { DIVINE_EGG_PETS } from "./pets/divine";
import { DWELLER_EGG_PETS } from "./pets/dweller";
import { EVENT_500k_EGG_PETS } from "./pets/event500k";
import { EXCLUSIVE_PETS } from "./pets/exclusive";
import { GEARWORX_EGG_PETS } from "./pets/gearworx";
import { GROUP_CHEST_PETS } from "./pets/group";
import { HONEYCOMB_EGG_PETS } from "./pets/honeycomb";
import { JESTER_EGG_PETS } from "./pets/jester";
import { MOLTEN_EGG_PETS } from "./pets/molten";
import { RADIOACTIVE_EGG_PETS } from "./pets/radioactive";
import { ROYALTY_EGG_PETS } from "./pets/royalty";
import { STARTER_EGG_PETS } from "./pets/starter";
import { WORLD_PRESTIGE_PETS } from "./pets/worldPrestige";
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

	/**
	 * Whether or not the egg is hidden.
	 */
	hidden: boolean;

	/**
	 * Whether or not luck boost and luck events apply to the egg.
	 */
	luckApplies: boolean;
}

export const isValidMasteryEgg = t.literal(
	"Starter",
	"Desert",
	"Honeycomb",
	"Candy",
	"Molten",
	"Jester",
	"Radioactive",
	"Jester",
	"Divine",
	"500k Event",
	"GearWorx",
	"Dweller",
);
export type ValidMasteryEgg = t.static<typeof isValidMasteryEgg>;

/**
 * All the eggs in the game.
 */
export const EGGS = {
	Starter: {
		id: 1,
		pets: STARTER_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: true,
		hidden: false,
		luckApplies: true,
	},
	Desert: {
		id: 2,
		pets: DESERT_EGG_PETS,
		world: "Ban Land",
		zone: "Desert",
		hatchable: true,
		hidden: false,
		luckApplies: true,
	},
	Honeycomb: {
		id: 3,
		pets: HONEYCOMB_EGG_PETS,
		world: "Ban Land",
		zone: "Honeycomb",
		hatchable: true,
		hidden: false,
		luckApplies: true,
	},
	Candy: {
		id: 4,
		pets: CANDY_EGG_PETS,
		world: "Ban Land",
		zone: "Candy Land",
		hatchable: true,
		hidden: false,
		luckApplies: true,
	},
	Molten: {
		id: 5,
		pets: MOLTEN_EGG_PETS,
		world: "Ban Land",
		zone: "Lava Lands",
		hatchable: true,
		hidden: false,
		luckApplies: true,
	},
	Royalty: {
		id: 6,
		pets: ROYALTY_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
		luckApplies: false,
	},
	City: {
		id: 7,
		pets: CITY_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: true,
		luckApplies: true,
	},
	Cyber: {
		id: 8,
		pets: CYBER_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: true,
		luckApplies: true,
	},
	Corrupt: {
		id: 9,
		pets: CORRUPT_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: true,
		luckApplies: true,
	},
	Armored: {
		id: 10,
		pets: ARMORED_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: true,
		luckApplies: true,
	},
	Radioactive: {
		id: 11,
		pets: RADIOACTIVE_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
		luckApplies: false,
	},
	Jester: {
		id: 12,
		pets: JESTER_EGG_PETS,
		world: "Ban Land",
		zone: "Jester Castle",
		hatchable: true,
		hidden: false,
		luckApplies: true,
	},
	Group: {
		id: 499,
		pets: GROUP_CHEST_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
		luckApplies: false,
	},
	Exclusive: {
		id: 500,
		pets: EXCLUSIVE_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
		luckApplies: false,
	},
	WorldPrestige: {
		id: 501,
		pets: WORLD_PRESTIGE_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
		luckApplies: false,
	},
	Divine: {
		id: 13,
		pets: DIVINE_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
		luckApplies: false,
	},
	"500k Event": {
		id: 14,
		pets: EVENT_500k_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
		luckApplies: true,
	},
	GearWorx: {
		id: 15,
		pets: GEARWORX_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: true,
		hidden: false,
		luckApplies: true,
	},
	Dweller: {
		id: 16,
		pets: DWELLER_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
		luckApplies: false,
	},
} satisfies Record<string, Egg>;

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
export const hatchDebounce = 2;
