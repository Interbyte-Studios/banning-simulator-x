import { preserveWithConstraint } from "shared/util/preserveWithConstraint";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { Currency } from "./currencies";

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

	weaponType: WeaponType;

	isBossWeapon: boolean;
}

export const MAX_WEAPON_ID = 24;
export const WEAPONS = preserveWithConstraint<Record<string, Weapon>>()({
	"Stone Hammer": {
		id: 1,
		cost: undefined,
		damage: 18,
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Basic Blade": {
		id: 2,
		cost: {
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("1.1k"),
		},
		damage: 35,
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Flower Blade": {
		id: 3,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("2.2k"),
		},
		damage: 90,
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Stone Smacker": {
		id: 4,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("3.4k"),
		},
		damage: 200,
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Spark Plug": {
		id: 5,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("8.3k"),
		},
		damage: 450,
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Bomba Bomber": {
		id: 6,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("10.2k"),
		},
		damage: 800,
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Forest Slammer": {
		id: 7,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("20k"),
		},
		damage: twoDpAbbreviator.stringToNumber("2.2k"),
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Honey Whacker": {
		id: 8,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("30.4k"),
		},
		damage: twoDpAbbreviator.stringToNumber("3.8k"),
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Darkest Desires": {
		id: 9,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("81k"),
		},
		damage: twoDpAbbreviator.stringToNumber("9k"),
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Gooey Brawler": {
		id: 10,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("122k"),
		},
		damage: twoDpAbbreviator.stringToNumber("16.5k"),
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Lime Lance": {
		id: 11,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("305k"),
		},
		damage: twoDpAbbreviator.stringToNumber("55k"),
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Carnival Mallet": {
		id: 12,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("455k"),
		},
		damage: twoDpAbbreviator.stringToNumber("102k"),
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Samurai Smasher": {
		id: 13,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("920k"),
		},
		damage: twoDpAbbreviator.stringToNumber("155k"),
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Atlantis Blade": {
		id: 14,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("1.3M"),
		},
		damage: twoDpAbbreviator.stringToNumber("210k"),
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Sunflower Slammer": {
		id: 15,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("2M"),
		},
		damage: twoDpAbbreviator.stringToNumber("475k"),
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Dune Glass": {
		id: 16,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("3.9M"),
		},
		damage: twoDpAbbreviator.stringToNumber("600k"),
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Atlantis Basher": {
		id: 17,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("4.7M"),
		},
		damage: twoDpAbbreviator.stringToNumber("1.1M"),
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Infernal Staff": {
		id: 18,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("5.9M"),
		},
		damage: twoDpAbbreviator.stringToNumber("1.8M"),
		weaponType: "Lance",
		isBossWeapon: false,
	},
	"Galactic Blade": {
		id: 19,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("11.6M"),
		},
		damage: twoDpAbbreviator.stringToNumber("2.4M"),
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Crimson Jewel": {
		id: 20,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("25M"),
		},
		damage: twoDpAbbreviator.stringToNumber("3M"),
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Twilight Blade": {
		id: 21,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("37.5M"),
		},
		damage: twoDpAbbreviator.stringToNumber("3.7M"),
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Hellfire Slasher": {
		id: 22,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("75M"),
		},
		damage: twoDpAbbreviator.stringToNumber("8M"),
		weaponType: "Sword",
		isBossWeapon: false,
	},
	"Pillar Slammer": {
		id: 23,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("150M"),
		},
		damage: twoDpAbbreviator.stringToNumber("14M"),
		weaponType: "Hammer",
		isBossWeapon: false,
	},
	"Haunted Blade": {
		id: 24,
		cost: {
			requiredRank: 1,
			currency: "coins",
			amount: twoDpAbbreviator.stringToNumber("350M"),
		},
		damage: twoDpAbbreviator.stringToNumber("20M"),
		weaponType: "Sword",
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
