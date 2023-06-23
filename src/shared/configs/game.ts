import assetIds from "shared/assets";

import { EggName } from "./eggs";

export const STORE_SCOPE = "TEST_STORE_5";

export const MAIN_GROUP = 5126818;
export const BANS_LEADERBOARD_ODS = `${STORE_SCOPE}_BANS_ODS`;
export const EGGS_LEADERBOARD_ODS = `${STORE_SCOPE}_EGGS_ODS`;
export const LEADERBOARD_UPDATE_INTERVAL = 60 * 30;

export const GAME_VERSION = "0.9.5";

export const MAX_TRADE_OFFER_SIZE = 10;
export const MAX_TRADE_LOGS = 10;

export type Gamepasses = keyof typeof GAMEPASSES;
export const GAMEPASSES = {
	//["Auto Hatch"]: 27753255,
	["x2 Luck"]: 27753234, // Implemented
	["Fast Hatch"]: 27753244, // Implemented
	["Triple Hatch"]: 27753252, // Implemented
	["x2 Currency"]: 27753265, // Implemented
	["x2 Experience"]: 142542236, // Implemented
	["Better Fusion"]: 142542125,
	VIP: 27753277, // Implemented
	["+800 Inventory"]: 142541811, // Implemented
	["+450 Inventory"]: 27753287, // Implemented
	["+250 Inventory"]: 27753294, // Implemented
	["+2 Pets Equipped"]: 27753303, // Implemented
	["+3 Pets Equipped"]: 27753311, // Implemented
	Teleportation: 27753320, // Implemented
	["Auto Fight"]: 146371039, // Implemented
};

export const GAMEPASS_ORDER = {
	["x2 Luck"]: 1, // Implemented
	["x2 Currency"]: 2, // Implemented
	["x2 Experience"]: 3, // Implemented
	["Better Fusion"]: 4,
	["Triple Hatch"]: 5, // Implemented
	["Fast Hatch"]: 6, // Implemented
	VIP: 7, // Implemented
	["Auto Fight"]: 8, // Implemented
	["+3 Pets Equipped"]: 9, // Implemented
	["+2 Pets Equipped"]: 10, // Implemented
	["+800 Inventory"]: 11, // Implemented
	["+450 Inventory"]: 12, // Implemented
	["+250 Inventory"]: 13, // Implemented
	Teleportation: 14, // Implemented
};

export const GAMEPASS_DESCRIPTIONS = {
	["x2 Luck"]: "Hatch rarer pets with this gamepass!", // Implemented
	["x2 Currency"]: "Get twice as much currency with this gamepass!", // Implemented
	["x2 Experience"]: "Get double the experience with this gamepass!", // Implemented
	["Better Fusion"]: "Fuse rarer pets with less resources!",
	["Triple Hatch"]: "Hatch 3 eggs at a time!", // Implemented
	["Fast Hatch"]: "Hatch eggs twice as fast with this gamepass!", // Implemented
	VIP: "Get a VIP chat tag, an exclusive pet, and daily rewards!", // Implemented
	["Auto Fight"]: "Automatically fight in all zones that you own!", // Implemented
	["+3 Pets Equipped"]: "Equip 3 extra pets! (Stacks)", // Implemented
	["+2 Pets Equipped"]: "Equip 2 extra pets! (Stacks)", // Implemented
	["+800 Inventory"]: "Get 800 extra pet inventory space!", // Implemented
	["+450 Inventory"]: "Get 450 extra pet inventory space!", // Implemented
	["+250 Inventory"]: "Get 250 extra pet inventory space!", // Implemented
	Teleportation: "Teleport to any zone that you own!", // Implemented
};

export type BoostProduct = keyof typeof BOOST_PRODUCTS;
export const BOOST_PRODUCTS = {
	["x2 Currency"]: {
		// Implemented
		15: 1383495064,
		30: 1383495384,
		60: 1383495520,
		120: 1383495744,
	},
	["x2 Hatching Luck"]: {
		// Implemented
		15: 1383497133,
		30: 1383497207,
		60: 1383497376,
		120: 1383497448,
	},
	["x2 Pet Experience"]: {
		// Implemented
		15: 1383496504,
		30: 1383496578,
		60: 1383496678,
		120: 1383496828,
	},
	["x2 Rank Experience"]: {
		// Implemented
		15: 1383495941,
		30: 1383495994,
		60: 1383496197,
		120: 1383496328,
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
		15: assetIds.images.vectors.boosts.purpleSingle,
		30: assetIds.images.vectors.boosts.purpleDouble,
		60: assetIds.images.vectors.boosts.purpleTriple,
		120: assetIds.images.vectors.boosts.purpleCrate,
	},
	["x2 Pet Experience"]: {
		15: assetIds.images.vectors.boosts.orangeSingle,
		30: assetIds.images.vectors.boosts.orangeDouble,
		60: assetIds.images.vectors.boosts.orangeTriple,
		120: assetIds.images.vectors.boosts.orangeCrate,
	},
	["x2 Hatching Luck"]: {
		15: assetIds.images.vectors.boosts.greenSingle,
		30: assetIds.images.vectors.boosts.greenDouble,
		60: assetIds.images.vectors.boosts.greenTriple,
		120: assetIds.images.vectors.boosts.greenCrate,
	},
};

export const PURCHASE_PET_TEAM_PRODUCT = 1383498501;
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
		tag: "Administrator",
		color: Color3.fromRGB(255, 138, 138),
	},
	252: {
		tag: "In-Game Moderator / Senior Tester",
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
		tag: "Contributors",
		color: Color3.fromRGB(5, 209, 179),
	},
	247: {
		tag: "Bee Man!",
		color: Color3.fromRGB(255, 199, 41),
	},
	246: {
		tag: "Legendary Fan",
		color: Color3.fromRGB(212, 128, 227),
	},
	245: {
		tag: "Member",
		color: Color3.fromRGB(199, 51, 186),
	},
};

export const VIP_PET_ID = 10002;
export const GROUP_PET_ID = 10001;

export const LIMITED_EGG_DEVPRODUCT = {
	OneEgg: 1563247508,
	ThreeEggs: 1563247707,
};

export const LIMITED_EGG: EggName = "Royalty"; // The id of the robux egg currently on sale. In this case, id 6 means Royal egg.
export const EXCLUSIVE_PETS = [
	// The shop only supports adding 3 pets for exclusive pets. If we want to add more, we'll need to rework the shop a bit.
	{
		id: 1,
		petId: 10003,
		devproductId: 1563218005,
	},
	{
		id: 2,
		petId: 10004,
		devproductId: 1563218181,
	},
	{
		id: 3,
		petId: 10005,
		devproductId: 1563218391,
	},
];
