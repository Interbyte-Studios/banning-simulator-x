import { Pet } from ".";

export const PASTEL_EGG_PETS: Record<string, Pet> = {
	"Pastel Bee": {
		chance: 75,
		id: 181,
		rarity: "Exclusive",
		stats: {
			additionalDamage: 11_000_000,
			additionalBans: 500,
		},
	},
	"Pastel Doggy Plushie": {
		chance: 21,
		id: 182,
		rarity: "Exclusive",
		stats: {
			additionalDamage: 13_500_000,
			additionalBans: 1_125,
		},
	},
	"Pastel Bunny Plushie": {
		chance: 3.5,
		id: 183,
		rarity: "Exclusive",
		stats: {
			additionalDamage: 15_750_000,
			additionalBans: 1_687,
		},
	},
	"Pastel Dragon Plushie": {
		chance: 0.5,
		id: 184,
		rarity: "Exclusive",
		stats: {
			additionalDamage: 16_250_000,
			additionalBans: 2_530,
		},
	},
};
