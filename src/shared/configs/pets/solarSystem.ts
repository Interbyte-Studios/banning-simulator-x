import { Pet } from ".";

export const SOLAR_SYSTEM_EGG_PETS: Array<Pet> = [
	{
		name: "Pluto",
		chance: 75,
		id: 210,
		rarity: "Exclusive",
		stats: {
			additionalDamage: 12_500_000,
			additionalBans: 4_000,
		},
	},
	{
		name: "The Moon",
		chance: 21,
		id: 211,
		rarity: "Exclusive",
		stats: {
			additionalDamage: 15_000_000,
			additionalBans: 5_500,
		},
	},
	{
		name: "The Earth",
		chance: 3.5,
		id: 212,
		rarity: "Exclusive",
		stats: {
			additionalDamage: 17_500_000,
			additionalBans: 8_000,
		},
	},
	{
		name: "The Sun",
		chance: 0.5,
		id: 213,
		rarity: "Exclusive",
		stats: {
			additionalDamage: 20_000_000,
			additionalBans: 10_000,
		},
	},
];
