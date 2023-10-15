import { t } from "@rbxts/t";

import { Pet } from "./pets";
import { ARMORED_EGG_PETS } from "./pets/armored";
import { AUTUMN_EGG_PETS } from "./pets/autumn";
import { BLACKHOLE_EGG_PETS } from "./pets/blackhole";
import { CANDY_EGG_PETS } from "./pets/candy";
import { CITY_EGG_PETS } from "./pets/city";
import { CORRUPT_EGG_PETS } from "./pets/corrupt";
import { CRYSTAL_EGG_PETS } from "./pets/crystal";
import { CYBER_EGG_PETS } from "./pets/cyber";
import { DESERT_EGG_PETS } from "./pets/desert";
import { DIVINE_EGG_PETS } from "./pets/divine";
import { DWELLER_EGG_PETS } from "./pets/dweller";
import { EVENT_500k_EGG_PETS } from "./pets/event500k";
import { EXCLUSIVE_PETS } from "./pets/exclusive";
import { FIGHTER_EGG_PETS } from "./pets/fighter";
import { GEARWORX_EGG_PETS } from "./pets/gearworx";
import { GEOMETRIC_EGG_PETS } from "./pets/geometric";
import { GHOSTY_EGG_PETS } from "./pets/ghosty";
import { GROUP_CHEST_PETS } from "./pets/group";
import { HONEYCOMB_EGG_PETS } from "./pets/honeycomb";
import { JESTER_EGG_PETS } from "./pets/jester";
import { MOLTEN_EGG_PETS } from "./pets/molten";
import { NEON_EGG_PETS } from "./pets/neon";
import { PASTEL_EGG_PETS } from "./pets/pastel";
import { PIXEL_EGG_PETS } from "./pets/pixel";
import { PUFFERFISH_EGG_PETS } from "./pets/pufferfish";
import { RADIOACTIVE_EGG_PETS } from "./pets/radioactive";
import { ROYALTY_EGG_PETS } from "./pets/royalty";
import { SOLAR_SYSTEM_EGG_PETS } from "./pets/solarSystem";
import { STARTER_EGG_PETS } from "./pets/starter";
import { THROWBACK_EGG_PETS } from "./pets/throwback";
import { THROWBACK_2_EGG_PETS } from "./pets/throwback2";
import { TWO_MILLION_EGG_PETS } from "./pets/twoMillion";
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
	pets: Array<Pet>;

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
	"Throwback",
	"City",
	"Cybernetic",
	"Corrupt",
	"Armored",
	"Royalty",
	"Neon",
	"Pixel",
	"Crystal",
	"Pastel",
	"Geometric",
	"Throwback 2.0",
	"Autumn",
	"Solar System",
	"Blackhole",
	"Pufferfish",
	"TwoMillion",
	"Ghosty",
	"Fighter",
);
export type ValidMasteryEgg = t.static<typeof isValidMasteryEgg>;

export const isEventEgg = t.literal(
	"500k Event",
	"Throwback",
	"Pixel",
	"Crystal",
	"Throwback 2.0",
	"Autumn",
	"Blackhole",
	"TwoMillion",
	"Ghosty",
);
export type EventEgg = t.static<typeof isEventEgg>;

export const isExclusiveEgg = t.literal(
	"Royalty",
	"Radioactive",
	"Divine",
	"Dweller",
	"Neon",
	"Geometric",
	"Pastel",
	"Exclusive",
	"Solar System",
	"Pufferfish",
	"Fighter",
);
export type ExclusiveEgg = t.static<typeof isExclusiveEgg>;

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
	},
	Desert: {
		id: 2,
		pets: DESERT_EGG_PETS,
		world: "Ban Land",
		zone: "Desert",
		hatchable: true,
		hidden: false,
	},
	Honeycomb: {
		id: 3,
		pets: HONEYCOMB_EGG_PETS,
		world: "Ban Land",
		zone: "Honeycomb",
		hatchable: true,
		hidden: false,
	},
	Candy: {
		id: 4,
		pets: CANDY_EGG_PETS,
		world: "Ban Land",
		zone: "Candy Land",
		hatchable: true,
		hidden: false,
	},
	Molten: {
		id: 5,
		pets: MOLTEN_EGG_PETS,
		world: "Ban Land",
		zone: "Lava Lands",
		hatchable: true,
		hidden: false,
	},
	Royalty: {
		id: 6,
		pets: ROYALTY_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	City: {
		id: 7,
		pets: CITY_EGG_PETS,
		world: "Cyber Cities",
		zone: "Neon City",
		hatchable: true,
		hidden: false,
	},
	Cybernetic: {
		id: 8,
		pets: CYBER_EGG_PETS,
		world: "Cyber Cities",
		zone: "Malware Mayhem",
		hatchable: true,
		hidden: false,
	},
	Corrupt: {
		id: 9,
		pets: CORRUPT_EGG_PETS,
		world: "Cyber Cities",
		zone: "B1n4ry Z0n3",
		hatchable: true,
		hidden: false,
	},
	Armored: {
		id: 10,
		pets: ARMORED_EGG_PETS,
		world: "Cyber Cities",
		zone: "Lunar Realm",
		hatchable: true,
		hidden: false,
	},
	Radioactive: {
		id: 11,
		pets: RADIOACTIVE_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	Jester: {
		id: 12,
		pets: JESTER_EGG_PETS,
		world: "Ban Land",
		zone: "Jester Castle",
		hatchable: true,
		hidden: false,
	},
	Group: {
		id: 499,
		pets: GROUP_CHEST_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	Exclusive: {
		id: 500,
		pets: EXCLUSIVE_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	WorldPrestige: {
		id: 501,
		pets: WORLD_PRESTIGE_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	Divine: {
		id: 13,
		pets: DIVINE_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	"500k Event": {
		id: 14,
		pets: EVENT_500k_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	GearWorx: {
		id: 15,
		pets: GEARWORX_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: true,
		hidden: false,
	},
	Dweller: {
		id: 16,
		pets: DWELLER_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	Throwback: {
		id: 17,
		pets: THROWBACK_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: false,
		hidden: false,
	},
	Neon: {
		id: 18,
		pets: NEON_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	Pixel: {
		id: 19,
		pets: PIXEL_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: false,
		hidden: false,
	},
	Crystal: {
		id: 20,
		pets: CRYSTAL_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: false,
		hidden: false,
	},
	Pastel: {
		id: 21,
		pets: PASTEL_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	Geometric: {
		id: 22,
		pets: GEOMETRIC_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	"Throwback 2.0": {
		id: 23,
		pets: THROWBACK_2_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: false,
		hidden: false,
	},
	Autumn: {
		id: 24,
		pets: AUTUMN_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: false,
		hidden: false,
	},
	"Solar System": {
		id: 25,
		pets: SOLAR_SYSTEM_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	Blackhole: {
		id: 26,
		pets: BLACKHOLE_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: false,
		hidden: false,
	},
	Pufferfish: {
		id: 27,
		pets: PUFFERFISH_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
	},
	TwoMillion: {
		id: 28,
		pets: TWO_MILLION_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: false,
		hidden: false,
	},
	Ghosty: {
		id: 29,
		pets: GHOSTY_EGG_PETS,
		world: "Ban Land",
		zone: "Forest",
		hatchable: true,
		hidden: false,
	},
	Fighter: {
		id: 30,
		pets: FIGHTER_EGG_PETS,
		world: "Limited",
		zone: "Limited",
		hatchable: false,
		hidden: false,
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
export const hatchDebounce = 1.5;
