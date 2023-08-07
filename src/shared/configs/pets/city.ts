import { Pet } from ".";

/**
 * City egg.
 */
export const CITY_EGG_PETS: Record<string, Pet> = {
	"City Doggy": {
		chance: 32.3,
		id: 47,
		rarity: "Basic",
		stats: {
			additionalDamage: 19_800,
			additionalBans: 105,
		},
	},
	"City Bunny": {
		chance: 30,
		id: 48,
		rarity: "Basic",
		stats: {
			additionalDamage: 22_500,
			additionalBans: 125,
		},
	},
	"City Kitty": {
		chance: 20,
		id: 49,
		rarity: "Ordinary",
		stats: {
			additionalDamage: 27_900,
			additionalBans: 145,
		},
	},
	"City Deer": {
		chance: 10,
		id: 50,
		rarity: "Rare",
		stats: {
			additionalDamage: 36_000,
			additionalBans: 165,
		},
	},
	"City Angel": {
		chance: 7.5,
		id: 51,
		rarity: "Rare",
		stats: {
			additionalDamage: 39_500,
			additionalBans: 175,
		},
	},
	"City Defender": {
		chance: 0.2,
		id: 52,
		rarity: "Legendary",
		stats: {
			additionalDamage: 53_500,
			additionalBans: 200,
		},
	},
};
