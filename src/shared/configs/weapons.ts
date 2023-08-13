import { Currency } from "./currencies";
import { WorldName } from "./worlds";

export type WeaponType = "Hammer" | "Lance" | "Sword";

export interface Weapon {
	id: number;

	cost: {
		requiredRank: number;
		currency: Currency;
		amount: number;
	};

	damage: number;

	world: WorldName;

	weaponType: WeaponType;
}

export const MAX_WEAPON_ID = 71;
export const WEAPONS = {
	/* First Zone */
	"Stone Hammer": {
		id: 1,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: 0,
		},
		damage: 10,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"Basic Blade": {
		id: 2,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: 100,
		},
		damage: 12,
		world: "Ban Land",
		weaponType: "Sword",
	},
	"Flower Blade": {
		id: 3,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: 150,
		},
		damage: 14,
		world: "Ban Land",
		weaponType: "Sword",
	},
	"Stone Smacker": {
		id: 4,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: 200,
		},
		damage: 16,
		world: "Ban Land",
		weaponType: "Hammer",
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
	},

	// GearWorx Time Trials
	"GearWorx Lance": {
		id: 48,
		cost: {
			requiredRank: 10,
			currency: "gears",
			amount: 2_000_000,
		},
		damage: 40_000,
		world: "Ban Land",
		weaponType: "Lance",
	},
	"GearWorx Blade": {
		id: 49,
		cost: {
			requiredRank: 10,
			currency: "gears",
			amount: 10_000_000,
		},
		damage: 55_000,
		world: "Ban Land",
		weaponType: "Sword",
	},
	"GearWorx Scythe": {
		id: 50,
		cost: {
			requiredRank: 10,
			currency: "gears",
			amount: 39_000_000,
		},
		damage: 80_000,
		world: "Ban Land",
		weaponType: "Sword",
	},
	"GearWorx Striker": {
		id: 51,
		cost: {
			requiredRank: 10,
			currency: "gears",
			amount: 50_000_000,
		},
		damage: 100_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},

	// Neon City
	"City Lights Smasher": {
		id: 52,
		cost: {
			requiredRank: 11,
			currency: "cyber tokens",
			amount: 600,
		},
		damage: 57_500,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"City Lights Slasher": {
		id: 53,
		cost: {
			requiredRank: 11,
			currency: "cyber tokens",
			amount: 1_200,
		},
		damage: 65_536,
		world: "Ban Land",
		weaponType: "Sword",
	},

	// Electric Center
	"Electro Basher": {
		id: 54,
		cost: {
			requiredRank: 12,
			currency: "cyber tokens",
			amount: 1_800,
		},
		damage: 98_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"Electro Slicer": {
		id: 55,
		cost: {
			requiredRank: 12,
			currency: "cyber tokens",
			amount: 3_600,
		},
		damage: 131_040,
		world: "Ban Land",
		weaponType: "Sword",
	},

	// Neon District
	"Neon Thrasher": {
		id: 56,
		cost: {
			requiredRank: 13,
			currency: "cyber tokens",
			amount: 5_400,
		},
		damage: 201_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"Naonic GreatBlade": {
		id: 57,
		cost: {
			requiredRank: 13,
			currency: "cyber tokens",
			amount: 10_800,
		},
		damage: 262_144,
		world: "Ban Land",
		weaponType: "Sword",
	},

	// Cybershroom Forest
	"Matrix Conductor": {
		id: 58,
		cost: {
			requiredRank: 14,
			currency: "cyber tokens",
			amount: 16_200,
		},
		damage: 478_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"Matrix Enforcer": {
		id: 59,
		cost: {
			requiredRank: 14,
			currency: "cyber tokens",
			amount: 32_400,
		},
		damage: 524_288,
		world: "Ban Land",
		weaponType: "Sword",
	},

	// Malware Mayhem
	"Digital Thrasher": {
		id: 60,
		cost: {
			requiredRank: 15,
			currency: "cyber tokens",
			amount: 48_600,
		},
		damage: 776_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"Digital Slasher": {
		id: 61,
		cost: {
			requiredRank: 15,
			currency: "cyber tokens",
			amount: 97_200,
		},
		damage: 1_048_576,
		world: "Ban Land",
		weaponType: "Sword",
	},

	// UFO Valley
	"UFO Slammer": {
		id: 62,
		cost: {
			requiredRank: 16,
			currency: "cyber tokens",
			amount: 291_600,
		},
		damage: 1_650_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"UFO Slasher": {
		id: 63,
		cost: {
			requiredRank: 16,
			currency: "cyber tokens",
			amount: 583_200,
		},
		damage: 2_097_152,
		world: "Ban Land",
		weaponType: "Sword",
	},

	// Holographic Museum
	"Cyber Smasher": {
		id: 64,
		cost: {
			requiredRank: 17,
			currency: "cyber tokens",
			amount: 874_800,
		},
		damage: 3_240_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"Cyber Slasher": {
		id: 65,
		cost: {
			requiredRank: 17,
			currency: "cyber tokens",
			amount: 1_749_600,
		},
		damage: 4_194_304,
		world: "Ban Land",
		weaponType: "Sword",
	},

	// Binary Zone
	"Glitched Banner": {
		id: 66,
		cost: {
			requiredRank: 18,
			currency: "cyber tokens",
			amount: 2_624_400,
		},
		damage: 6_824_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"Glitched Slasher": {
		id: 67,
		cost: {
			requiredRank: 18,
			currency: "cyber tokens",
			amount: 5_248_800,
		},
		damage: 8_388_608,
		world: "Ban Land",
		weaponType: "Sword",
	},

	// Cortex
	"Energy Slammer": {
		id: 68,
		cost: {
			requiredRank: 19,
			currency: "cyber tokens",
			amount: 9_850_000,
		},
		damage: 14_225_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"Energy Slasher": {
		id: 69,
		cost: {
			requiredRank: 19,
			currency: "cyber tokens",
			amount: 15_746_400,
		},
		damage: 16_777_216,
		world: "Ban Land",
		weaponType: "Sword",
	},

	// Lunar Realm
	"Dreamy Slammer": {
		id: 70,
		cost: {
			requiredRank: 20,
			currency: "cyber tokens",
			amount: 35_250_000,
		},
		damage: 28_500_000,
		world: "Ban Land",
		weaponType: "Hammer",
	},
	"Dreamy Slasher": {
		id: 71,
		cost: {
			requiredRank: 20,
			currency: "cyber tokens",
			amount: 47_239_200,
		},
		damage: 33_554_432,
		world: "Ban Land",
		weaponType: "Sword",
	},
} satisfies Record<string, Weapon>;

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
