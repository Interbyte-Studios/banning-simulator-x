import { preserveWithConstraint } from "shared/util/preserveWithConstraint";
import { twoDpAbbreviator } from "shared/util/twoDpAbbreviator";

import { Currency } from "./currencies";

export interface Weapon {
	cost:
		| {
				requiredRank?: number;
				currency: Currency;
				amount: number;
		  }
		| undefined;

	damage: number;

	isBossWeapon: boolean;
}

export type WeaponIndex = keyof typeof WEAPONS;
export const WEAPONS = preserveWithConstraint<Record<string, Weapon>>()({
	"Stone Hammer": {
		cost: undefined,
		damage: 18,
		isBossWeapon: false,
	},
	"Basic Blade": {
		cost: {
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("1.1k"),
		},
		damage: 35,
		isBossWeapon: false,
	},
	"Flower Blade": {
		cost: {
			requiredRank: 2,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("2.2k"),
		},
		damage: 90,
		isBossWeapon: false,
	},
	"Stone Smacker": {
		cost: {
			requiredRank: 2,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("3.4k"),
		},
		damage: 200,
		isBossWeapon: false,
	},
	"Bomba Bomber": {
		cost: {
			requiredRank: 4,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("8.3k"),
		},
		damage: 450,
		isBossWeapon: false,
	},
	"Honey Whacker": {
		cost: {
			requiredRank: 4,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("10.2k"),
		},
		damage: 800,
		isBossWeapon: false,
	},
	"Spark Plug": {
		cost: {
			requiredRank: 6,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("20k"),
		},
		damage: twoDpAbbreviator.stringToNumber("2.2k"),
		isBossWeapon: false,
	},
	"Darkest Desires": {
		cost: {
			requiredRank: 6,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("30.4k"),
		},
		damage: twoDpAbbreviator.stringToNumber("3.8k"),
		isBossWeapon: false,
	},
	"Gooey Brawler": {
		cost: {
			requiredRank: 8,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("81k"),
		},
		damage: twoDpAbbreviator.stringToNumber("9k"),
		isBossWeapon: false,
	},
	"Lime Lance": {
		cost: {
			requiredRank: 8,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("122k"),
		},
		damage: twoDpAbbreviator.stringToNumber("16.5k"),
		isBossWeapon: false,
	},
	"Carnival Mallet": {
		cost: {
			requiredRank: 10,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("305k"),
		},
		damage: twoDpAbbreviator.stringToNumber("55k"),
		isBossWeapon: false,
	},
	"Samurai Smasher": {
		cost: {
			requiredRank: 10,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("455k"),
		},
		damage: twoDpAbbreviator.stringToNumber("102k"),
		isBossWeapon: false,
	},
	"Atlantis Blade": {
		cost: {
			requiredRank: 12,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("920k"),
		},
		damage: twoDpAbbreviator.stringToNumber("155k"),
		isBossWeapon: false,
	},
	"Sunflower Slammer": {
		cost: {
			requiredRank: 12,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("1.3M"),
		},
		damage: twoDpAbbreviator.stringToNumber("210k"),
		isBossWeapon: false,
	},
	"Dune Glass": {
		cost: {
			requiredRank: 12,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("2M"),
		},
		damage: twoDpAbbreviator.stringToNumber("475k"),
		isBossWeapon: false,
	},
	"Forest Slammer": {
		cost: {
			requiredRank: 14,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("3.9M"),
		},
		damage: twoDpAbbreviator.stringToNumber("600k"),
		isBossWeapon: false,
	},
	"Atlantis Basher": {
		cost: {
			requiredRank: 14,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("4.7M"),
		},
		damage: twoDpAbbreviator.stringToNumber("1.1M"),
		isBossWeapon: false,
	},
	"Infernal Staff": {
		cost: {
			requiredRank: 14,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("5.9M"),
		},
		damage: twoDpAbbreviator.stringToNumber("1.8M"),
		isBossWeapon: false,
	},
	"Galactic Blade": {
		cost: {
			requiredRank: 16,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("11.6M"),
		},
		damage: twoDpAbbreviator.stringToNumber("2.4M"),
		isBossWeapon: false,
	},
	"Crimson Jewel": {
		cost: {
			requiredRank: 16,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("25M"),
		},
		damage: twoDpAbbreviator.stringToNumber("3M"),
		isBossWeapon: false,
	},
	"Haunted Blade": {
		cost: {
			requiredRank: 16,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("37.5M"),
		},
		damage: twoDpAbbreviator.stringToNumber("3.7M"),
		isBossWeapon: false,
	},
	"Pillar Slammer": {
		cost: {
			requiredRank: 17,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("75M"),
		},
		damage: twoDpAbbreviator.stringToNumber("8M"),
		isBossWeapon: false,
	},
	"Twilight Blade": {
		cost: {
			requiredRank: 17,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("150M"),
		},
		damage: twoDpAbbreviator.stringToNumber("14M"),
		isBossWeapon: false,
	},
	"Hellfire Slasher": {
		cost: {
			requiredRank: 18,
			currency: "gold",
			amount: twoDpAbbreviator.stringToNumber("350M"),
		},
		damage: twoDpAbbreviator.stringToNumber("20M"),
		isBossWeapon: false,
	},
});
