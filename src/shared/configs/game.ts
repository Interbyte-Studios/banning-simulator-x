import assetIds from "shared/assets";

export const MAIN_GROUP = 5126818;

export type Gamepasses = keyof typeof GAMEPASSES;
export const GAMEPASSES = {
	//["Auto Hatch"]: 27753255,
	["x2 Luck"]: 27753234, // Implemented
	["Fast Hatch"]: 27753244, // Implemented
	["Triple Hatch"]: 27753252, // Implemented
	["x2 Currency"]: 27753265, // Implemented
	["x2 Experience"]: 142542236, // Implemented
	["Better Fusion"]: 142542125,
	VIP: 27753277,
	["+800 Inventory"]: 142541811, // Implemented
	["+450 Inventory"]: 27753287, // Implemented
	["+250 Inventory"]: 27753294, // Implemented
	["+2 Pets Equipped"]: 27753303, // Implemented
	["+3 Pets Equipped"]: 27753311, // Implemented
	Teleportation: 27753320, // Implemented
};

export type BoostProduct = keyof typeof BOOST_PRODUCTS;
export const BOOST_PRODUCTS = {
	["x2 Currency"]: {
		// Implemented
		15: 20750907,
		30: 20750916,
		60: 20750923,
		120: 20750965,
	},
	["x2 Rank Experience"]: {
		// Implemented
		15: 20750971,
		30: 20750974,
		60: 20750981,
		120: 20750990,
	},
	["x2 Pet Experience"]: {
		// Implemented
		15: 20750995,
		30: 20750996,
		60: 20751002,
		120: 20751006,
	},
	["x2 Hatching Luck"]: {
		// Implemented
		15: 20751056,
		30: 20751060,
		60: 20751062,
		120: 20751066,
	},
};

export const BOOST_IMAGES = {
	["x2 Currency"]: {
		15: assetIds.images.vectors.boosts.blueSingle,
		30: assetIds.images.vectors.boosts.blueDouble,
		60: assetIds.images.vectors.boosts.BlueTriple,
		120: assetIds.images.vectors.boosts.blueCrate,
	},
	["x2 Rank Experience"]: {
		15: assetIds.images.vectors.boosts.greenSingle,
		30: assetIds.images.vectors.boosts.greenDouble,
		60: assetIds.images.vectors.boosts.greenTriple,
		120: assetIds.images.vectors.boosts.greenCrate,
	},
	["x2 Pet Experience"]: {
		15: assetIds.images.vectors.boosts.orangeSingle,
		30: assetIds.images.vectors.boosts.orangeDouble,
		60: assetIds.images.vectors.boosts.orangeTriple,
		120: assetIds.images.vectors.boosts.orangeCrate,
	},
	["x2 Hatching Luck"]: {
		15: assetIds.images.vectors.boosts.purpleSingle,
		30: assetIds.images.vectors.boosts.purpleDouble,
		60: assetIds.images.vectors.boosts.purpleTriple,
		120: assetIds.images.vectors.boosts.purpleCrate,
	},
};

export const PURCHASE_PET_TEAM_PRODUCT = 20751132;
export const PURCHASE_PET_TEAM_PRODUCT_COST = 149;

export const GROUP_ID = 5126818;
export const GROUP_ROLES: Record<number, { tag: string; color: Color3 }> = {
	255: {
		tag: "Holder",
		color: Color3.fromRGB(255, 138, 138),
	},
	254: {
		tag: "Lead Developer",
		color: Color3.fromRGB(255, 138, 138),
	},
	253: {
		tag: "Developer",
		color: Color3.fromRGB(255, 138, 138),
	},
	252: {
		tag: "Contributor",
		color: Color3.fromRGB(0, 181, 237),
	},
	251: {
		tag: "Tester",
		color: Color3.fromRGB(166, 247, 135),
	},
	250: {
		tag: "Moderator",
		color: Color3.fromRGB(196, 94, 242),
	},
	249: {
		tag: "Partner",
		color: Color3.fromRGB(255, 191, 120),
	},
	248: {
		tag: "Legendary Fan",
		color: Color3.fromRGB(5, 209, 179),
	},
	247: {
		tag: "Fan",
		color: Color3.fromRGB(5, 209, 179),
	},
};
