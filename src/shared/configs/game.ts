import { t } from "@rbxts/t";
import assetIds from "shared/assets";

import { Currency, TrialsCurrency } from "./currencies";
import { EggName } from "./eggs";

export const STORE_SCOPE = "mainstore"; // Last test store was "TEST_STORE_5"

export const MAIN_GROUP = 5126818;
export const BANS_LEADERBOARD_ODS = `${STORE_SCOPE}_BANS_ODS_1`;
export const EGGS_LEADERBOARD_ODS = `${STORE_SCOPE}_EGGS_ODS_1`;
export const REBIRTH_LEADERBOARD_ODS = `${STORE_SCOPE}_REBIRTHS_ODS_1`;
export const LEADERBOARD_UPDATE_INTERVAL = 60;

export const GAME_VERSION = "10.0";

export const MAX_TRADE_OFFER_SIZE = 20;
export const MAX_TRADE_LOGS = 50;

export const TEN_SPINS = 1583558881;
export const ONE_HUNDRED_SPINS = 1583561170;

export const isCurrencyPurchaseOption = t.literal("pile", "bag", "chest", "vault");
export type CurrencyPurchaseOption = t.static<typeof isCurrencyPurchaseOption>;

export type CurrencyPurchaseType = Exclude<Currency, TrialsCurrency | "cyber tokens">;
export type CurrencyPurchase = {
	[P in CurrencyPurchaseType]: {
		[K in CurrencyPurchaseOption]: {
			devId: number;
			highestZoneMultiplier: number;
			image: string;
		};
	};
};
export const CURRENCY_PURCHASES: CurrencyPurchase = {
	coins: {
		pile: {
			devId: 1591316288,
			highestZoneMultiplier: 3,
			image: assetIds.images.vectors.currencies.CoinPile,
		},
		bag: {
			devId: 1591316820,
			highestZoneMultiplier: 9,
			image: assetIds.images.vectors.currencies.CoinBag,
		},
		chest: {
			devId: 1591317010,
			highestZoneMultiplier: 27,
			image: assetIds.images.vectors.currencies.CoinChest,
		},
		vault: {
			devId: 1591317249,
			highestZoneMultiplier: 81,
			image: assetIds.images.vectors.currencies.CoinSafe,
		},
	},
	gems: {
		pile: {
			devId: 1591317454,
			highestZoneMultiplier: 1,
			image: assetIds.images.vectors.currencies.GemPile,
		},
		bag: {
			devId: 1591317635,
			highestZoneMultiplier: 3,
			image: assetIds.images.vectors.currencies.GemBag,
		},
		chest: {
			devId: 1591317831,
			highestZoneMultiplier: 9,
			image: assetIds.images.vectors.currencies.GemChest,
		},
		vault: {
			devId: 1591318353,
			highestZoneMultiplier: 27,
			image: assetIds.images.vectors.currencies.GemVault,
		},
	},
};

export const isGamepass = t.literal(
	"x2 Luck",
	"Fast Hatch",
	"Triple Hatch",
	"x2 Currency",
	"x2 Experience",
	"Better Fusion",
	"VIP",
	"+800 Inventory",
	"+450 Inventory",
	"+250 Inventory",
	"+2 Pets Equipped",
	"+3 Pets Equipped",
	"Teleportation",
	"Auto Fight",
);
export type Gamepasses = t.static<typeof isGamepass>;
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

export const GAMEPASS_GIFTS = {
	["x2 Luck"]: 1580200704, // Implemented
	["Fast Hatch"]: 1580200893, // Implemented
	["Triple Hatch"]: 1580201093, // Implemented
	["x2 Currency"]: 1580201344, // Implemented
	["x2 Experience"]: 1580203585, // Implemented
	["Better Fusion"]: 1580203394,
	VIP: 1580201651, // Implemented
	["+800 Inventory"]: 1580203192, // Implemented
	["+450 Inventory"]: 1580202063, // Implemented
	["+250 Inventory"]: 1580202273, // Implemented
	["+2 Pets Equipped"]: 1580202541, // Implemented
	["+3 Pets Equipped"]: 1580202723, // Implemented
	Teleportation: 1580202907, // Implemented
	["Auto Fight"]: 1580203795, // Implemented
};

export const TELEPORTATIONS = {
	ZONES: {
		Forest: new Vector3(22825.732, 46.523, -16.729),
		Desert: new Vector3(22844.158, 46.523, 218.889),
		"Sunflower Field": new Vector3(22844.158, 46.523, 461.079),
		Honeycomb: new Vector3(22844.158, 46.523, 698.185),
		"Ice Land": new Vector3(22844.158, 46.523, 946.085),
		Beach: new Vector3(22844.158, 46.523, 1178.183),
		"Candy Land": new Vector3(22844.158, 46.523, 1423.812),
		"The Mines": new Vector3(22844.158, 46.523, 1638.864),
		"Lava Lands": new Vector3(22844.158, 46.523, 1876.721),
		"Enchanted Forest": new Vector3(22838.814, 46.523, 2110.527),
		"Toxic Lands": new Vector3(22826.715, 46.523, 2333.504),
		"Jester Castle": new Vector3(22826.715, 46.523, 2560.72),
		"Neon City": new Vector3(19092.432, 9.243, -24795.111),
		"Electric Center": new Vector3(19092.432, 9.243, -24973.75),
		"Neon District": new Vector3(19092.432, 9.243, -25165.09),
		"Cybershroom Forest": new Vector3(19092.432, 9.243, -25334.24),
		"Malware Mayhem": new Vector3(19092.432, 9.243, -25511.676),
		"UFO Valley": new Vector3(19092.432, 9.243, -25688.607),
		"Holographic Musuem": new Vector3(19092.432, 9.243, -25863.529),
		"B1n4ry Z0n3": new Vector3(19092.432, 9.243, -26045.961),
		Cortex: new Vector3(19110.428, 11.115, -26231.828),
		"Lunar Realm": new Vector3(19110.428, 11.115, -26402.367),
	},
	"Ban Land": {
		RANK_UPGRADE: new Vector3(22918.633, 46.567, -194.273),
	},
};

export const isBoost = t.literal("x2 Currency", "x2 Hatching Luck", "x2 Pet Experience", "x2 Rank Experience");
export type BoostProduct = t.static<typeof isBoost>;
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

export const PET_QUEST_PET_ID = 10012;
export const PET_QUEST_DEVPRODUCT = 1594044693;

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
	OneEgg: 1635052174,
	ThreeEggs: 1635052347,
};

export const LIMITED_EGG: EggName = "Pastel";
export const EXCLUSIVE_PETS = [
	// The shop only supports adding 3 pets for exclusive pets. If we want to add more, we'll need to rework the shop a bit.
	{
		id: 1,
		petId: 10008,
		devproductId: 1581587749,
	},
	{
		id: 2,
		petId: 10009,
		devproductId: 1581587940,
	},
	{
		id: 3,
		petId: 10010,
		devproductId: 1581588209,
	},
];
