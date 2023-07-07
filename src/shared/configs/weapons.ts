import { preserveWithConstraint } from "shared/util/preserveWithConstraint";

import { Currency } from "./currencies";
import { WorldName } from "./worlds";

export type WeaponType = "Hammer" | "Lance" | "Sword";

export interface Weapon {
	id: number;

	cost:
		| {
				requiredRank?: number;
				currency: Currency;
				amount: number;
		  }
		| undefined;

	damage: number;

	world: WorldName;

	weaponType: WeaponType;

	isBossWeapon: boolean;
}

export const MAX_WEAPON_ID = 47;
export const WEAPONS = preserveWithConstraint<Record<string, Weapon>>()({
	/* First Zone */
	"Stone Hammer": {
		id: 1,
		cost: undefined,
		damage: 10,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Basic Blade": {
		id: 2,
		cost: {
			currency: "coins",
			amount: 100,
		},
		damage: 12,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Flower Blade": {
		id: 3,
		cost: {
			currency: "coins",
			amount: 150,
		},
		damage: 14,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Stone Smacker": {
		id: 4,
		cost: {
			currency: "coins",
			amount: 200,
		},
		damage: 16,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},

	/* Desert */
	"Blade Of Mastery": {
		id: 5,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: 300,
		},
		damage: 20,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Machine Masher": {
		id: 6,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: 600,
		},
		damage: 24,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Starry Lance": {
		id: 7,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: 900,
		},
		damage: 28,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	Taliscythe: {
		id: 8,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: 1_200,
		},
		damage: 32,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},

	/* Sunflower Zone */
	"Sunflower Sword": {
		id: 9,
		cost: {
			requiredRank: 2,
			currency: "coins",
			amount: 1_500,
		},
		damage: 40,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Sunflower Basher": {
		id: 10,
		cost: {
			requiredRank: 2,
			currency: "coins",
			amount: 2_275,
		},
		damage: 48,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Sunflower Spear": {
		id: 11,
		cost: {
			requiredRank: 2,
			currency: "coins",
			amount: 3_000,
		},
		damage: 56,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Sunflower Slicer": {
		id: 12,
		cost: {
			requiredRank: 2,
			currency: "coins",
			amount: 4_500,
		},
		damage: 64,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},

	/* Honeycomb Zone */
	"Buzz Blade": {
		id: 13,
		cost: {
			requiredRank: 2,
			currency: "coins",
			amount: 5_000,
		},
		damage: 80,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Bumble Basher": {
		id: 14,
		cost: {
			requiredRank: 2,
			currency: "coins",
			amount: 6_500,
		},
		damage: 96,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Buzz Lance": {
		id: 15,
		cost: {
			requiredRank: 2,
			currency: "coins",
			amount: 7_500,
		},
		damage: 112,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Stinger Scythe": {
		id: 16,
		cost: {
			requiredRank: 2,
			currency: "coins",
			amount: 10_000,
		},
		damage: 128,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},

	/* Iceland Zone */
	"Atlantis Blade": {
		id: 17,
		cost: {
			requiredRank: 3,
			currency: "coins",
			amount: 12_500,
		},
		damage: 160,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Lime Lance": {
		id: 18,
		cost: {
			requiredRank: 3,
			currency: "coins",
			amount: 15_000,
		},
		damage: 192,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Atlantis Basher": {
		id: 19,
		cost: {
			requiredRank: 3,
			currency: "coins",
			amount: 20_000,
		},
		damage: 256,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},

	/* Beach Zone */
	"Aquatic Omegablade": {
		id: 20,
		cost: {
			requiredRank: 4,
			currency: "coins",
			amount: 25_000,
		},
		damage: 320,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Tropical Thrasher": {
		id: 21,
		cost: {
			requiredRank: 4,
			currency: "coins",
			amount: 30_000,
		},
		damage: 384,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Tropical Lance": {
		id: 22,
		cost: {
			requiredRank: 4,
			currency: "coins",
			amount: 35_000,
		},
		damage: 448,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Beach Scythe": {
		id: 23,
		cost: {
			requiredRank: 4,
			currency: "coins",
			amount: 40_000,
		},
		damage: 512,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},

	/* Candy Zone */
	"Candy Omegablade": {
		id: 24,
		cost: {
			requiredRank: 5,
			currency: "coins",
			amount: 50_000,
		},
		damage: 640,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Gumdrop Dropper": {
		id: 25,
		cost: {
			requiredRank: 5,
			currency: "coins",
			amount: 60_000,
		},
		damage: 768,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Candy Lance": {
		id: 26,
		cost: {
			requiredRank: 5,
			currency: "coins",
			amount: 70_000,
		},
		damage: 896,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Peppermint Scythe": {
		id: 27,
		cost: {
			requiredRank: 5,
			currency: "coins",
			amount: 85_000,
		},
		damage: 1_024,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},

	/* The Mines Zone */
	"Amethyst Greatblade": {
		id: 28,
		cost: {
			requiredRank: 6,
			currency: "coins",
			amount: 100_000,
		},
		damage: 1_280,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Crystalized Hammer": {
		id: 29,
		cost: {
			requiredRank: 6,
			currency: "coins",
			amount: 125_000,
		},
		damage: 1_536,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Amethyst Lance": {
		id: 30,
		cost: {
			requiredRank: 6,
			currency: "coins",
			amount: 175_000,
		},
		damage: 1_792,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Crystalized Scythe": {
		id: 31,
		cost: {
			requiredRank: 6,
			currency: "coins",
			amount: 225_000,
		},
		damage: 2_048,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},

	/* Lavaland Zone */
	"Molten Slasher": {
		id: 32,
		cost: {
			requiredRank: 7,
			currency: "coins",
			amount: 250_000,
		},
		damage: 2_560,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Molten Thrasher": {
		id: 33,
		cost: {
			requiredRank: 7,
			currency: "coins",
			amount: 500_000,
		},
		damage: 3_072,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Lava Lance": {
		id: 34,
		cost: {
			requiredRank: 7,
			currency: "coins",
			amount: 750_000,
		},
		damage: 3_584,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Molten Scythe": {
		id: 35,
		cost: {
			requiredRank: 7,
			currency: "coins",
			amount: 1_000_000,
		},
		damage: 4_096,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},

	// Enchanted Forest Zone
	"Enchanted Greatsword": {
		id: 36,
		cost: {
			requiredRank: 8,
			currency: "coins",
			amount: 1_350_000,
		},
		damage: 5_500,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Enchanted Lance": {
		id: 37,
		cost: {
			requiredRank: 8,
			currency: "coins",
			amount: 1_650_000,
		},
		damage: 6_200,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Enchanted Scythe": {
		id: 38,
		cost: {
			requiredRank: 8,
			currency: "coins",
			amount: 2_025_000,
		},
		damage: 6_950,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Enchanted Hammer": {
		id: 39,
		cost: {
			requiredRank: 8,
			currency: "coins",
			amount: 2_520_000,
		},
		damage: 8_192,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},

	// Radioactive Zone
	"Radioactive Lance": {
		id: 40,
		cost: {
			requiredRank: 9,
			currency: "coins",
			amount: 4_250_000,
		},
		damage: 12_900,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Radioactive Greatsword": {
		id: 41,
		cost: {
			requiredRank: 9,
			currency: "coins",
			amount: 5_000_000,
		},
		damage: 13_875,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Radioactive Scythe": {
		id: 42,
		cost: {
			requiredRank: 9,
			currency: "coins",
			amount: 5_850_000,
		},
		damage: 15_000,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Radioactive Smasher": {
		id: 43,
		cost: {
			requiredRank: 9,
			currency: "coins",
			amount: 6_720_000,
		},
		damage: 16_384,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},

	// Castle Zone
	"Radiant Lance": {
		id: 44,
		cost: {
			requiredRank: 10,
			currency: "coins",
			amount: 10_500_000,
		},
		damage: 22_000,
		world: "Ban Land",
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Radiant Greatsword": {
		id: 45,
		cost: {
			requiredRank: 10,
			currency: "coins",
			amount: 15_000_000,
		},
		damage: 25_000,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Radiant Scythe": {
		id: 46,
		cost: {
			requiredRank: 10,
			currency: "coins",
			amount: 25_000_000,
		},
		damage: 29_500,
		world: "Ban Land",
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Radiant Smasher": {
		id: 47,
		cost: {
			requiredRank: 10,
			currency: "coins",
			amount: 33_600_000,
		},
		damage: 32_768,
		world: "Ban Land",
		weaponType: "Hammer",
		isBossWeapon: false,
	},
});

export const WEAPON_LEVELS: Array<{ level: number; requiredBans: number }> = [
	{
		level: 1,
		requiredBans: 5,
	},
	{
		level: 2,
		requiredBans: 10,
	},
	{
		level: 3,
		requiredBans: 25,
	},
	{
		level: 4,
		requiredBans: 50,
	},
	{
		level: 5,
		requiredBans: 100,
	},
	{
		level: 6,
		requiredBans: 200,
	},
	{
		level: 7,
		requiredBans: 500,
	},
	{
		level: 8,
		requiredBans: 1000,
	},
	{
		level: 9,
		requiredBans: 2500,
	},
	{
		level: 10,
		requiredBans: 5000,
	},
];

export type Weapons = typeof WEAPONS;
export type WeaponIndex = keyof typeof WEAPONS;
