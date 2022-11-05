import { t } from "@rbxts/t";

import { Variants } from "./pets";

export const isPetEnhancementType = t.literal(
	"strength",
	"blessed",
	"helping hand",
	"experience",
	"fighter",
	"judgement",
	"harmony",
);
export type PetEnhancementType = t.static<typeof isPetEnhancementType>;

export const isPetEnhancementRarity = t.literal("basic", "rare", "epic", "legendary", "artifact");
export type PetEnhancementRarity = t.static<typeof isPetEnhancementRarity>;

export type EnhancePetMetadata = {
	category: PetEnhancementType;
	rarity: PetEnhancementRarity;
	variant: Variants;
};

interface Enhancements {
	pets: {
		[enhancementType in PetEnhancementType]: {
			[enhancementRarity in PetEnhancementRarity]?: {
				name: string;
				description: string;
				availableSlots: Array<Variants>;
			};
		};
	};
}

interface EnhancementBaseCosts {
	pets: {
		[variant in Variants]: {
			// base cost utilized for limited pets
			baseCost: number;

			// the amount of currency earned from defeating the specified number of bosses from the zone the pet comes from
			bossesBanned: number;
		};
	};
}

export const ENHANCEMENTS: Enhancements = {
	pets: {
		strength: {
			basic: {
				name: "Strength I",
				description: "Additional 2% damage",
				availableSlots: ["regular", "void"],
			},
			rare: {
				name: "Strength II",
				description: "Additional 4% damage",
				availableSlots: ["regular", "void"],
			},
			epic: {
				name: "Strength III",
				description: "Additional 7% damage",
				availableSlots: ["void", "radiant"],
			},
			legendary: {
				name: "Strength IV",
				description: "Additional 10% damage",
				availableSlots: ["void", "radiant"],
			},
			artifact: {
				name: "Strength V",
				description: "Additional 15% damage",
				availableSlots: ["radiant"],
			},
		},
		blessed: {
			basic: {
				name: "Blessed I",
				description: "Additional 5% currency from bosses",
				availableSlots: ["regular", "void"],
			},
			rare: {
				name: "Blessed II",
				description: "Additional 8% currency from bosses",
				availableSlots: ["regular", "void"],
			},
			epic: {
				name: "Blessed III",
				description: "Additional 11% currency from bosses",
				availableSlots: ["void", "radiant"],
			},
			legendary: {
				name: "Blessed IV",
				description: "Additional 14% currency from bosses",
				availableSlots: ["void", "radiant"],
			},
			artifact: {
				name: "Blessed V",
				description: "Additional 20% currency from bosses",
				availableSlots: ["radiant"],
			},
		},
		experience: {
			basic: {
				name: "Experience I",
				description: "Additional 5% experience",
				availableSlots: ["regular", "void"],
			},
			rare: {
				name: "Experience II",
				description: "Additional 8% experience",
				availableSlots: ["regular", "void"],
			},
			epic: {
				name: "Experience III",
				description: "Additional 11% experience",
				availableSlots: ["void", "radiant"],
			},
			legendary: {
				name: "Experience IV",
				description: "Additional 14% experience",
				availableSlots: ["void", "radiant"],
			},
			artifact: {
				name: "Experience V",
				description: "Additional 20% experience",
				availableSlots: ["radiant"],
			},
		},
		fighter: {
			basic: {
				name: "Fighter I",
				description: "Additional 3% damage dealt to bosses",
				availableSlots: ["regular", "void"],
			},
			rare: {
				name: "Fighter II",
				description: "Additional 6% damage dealt to bosses",
				availableSlots: ["regular", "void"],
			},
			epic: {
				name: "Fighter III",
				description: "Additional 9% damage dealt to bosses",
				availableSlots: ["void", "radiant"],
			},
			legendary: {
				name: "Fighter IV",
				description: "Additional 13% damage dealt to bosses",
				availableSlots: ["void", "radiant"],
			},
			artifact: {
				name: "Fighter V",
				description: "Additional 18% damage dealt to bosses",
				availableSlots: ["radiant"],
			},
		},
		"helping hand": {
			epic: {
				name: "Helping Hand I",
				description: "Additional 5% currency from bosses",
				availableSlots: ["void", "radiant"],
			},
			legendary: {
				name: "Helping Hand II",
				description: "Additional 8% currency from bosses",
				availableSlots: ["void", "radiant"],
			},
			artifact: {
				name: "Helping Hand III",
				description: "Additional 11% currency from bosses",
				availableSlots: ["radiant"],
			},
		},
		judgement: {
			artifact: {
				name: "Judgement",
				description: "All equipped pets receive additional 30% experience",
				availableSlots: ["radiant"],
			},
		},
		harmony: {
			artifact: {
				name: "Harmony",
				description: "Receive double fusion experience when fusing this pet",
				availableSlots: ["regular", "void"],
			},
		},
	},
};

export const ENHANCEMENT_BASE_COSTS: EnhancementBaseCosts = {
	pets: {
		regular: {
			baseCost: 1500,
			bossesBanned: 3,
		},
		void: {
			baseCost: 5000,
			bossesBanned: 6,
		},
		radiant: {
			baseCost: 25000,
			bossesBanned: 10,
		},
	},
};
