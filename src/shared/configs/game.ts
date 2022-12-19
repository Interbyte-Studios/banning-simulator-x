export const MAIN_GROUP = 5126818;

export type Gamepasses = keyof typeof GAMEPASSES;
export const GAMEPASSES = {
	["x2 Luck"]: 1,
	["Fast Hatch"]: 1,
	["Triple Hatch"]: 1,
	["x2 Currency"]: 1,
	["x2 Experience"]: 1,
	["x2 Fusion Luck"]: 1,
	VIP: 1,
	["+800 Inventory"]: 1,
	["+450 Inventory"]: 1,
	["+250 Inventory"]: 1,
	["+2 Pets Equipped"]: 1,
	["+3 Pets Equipped"]: 1,
	Teleportation: 1,
};

export type BoostProduct = keyof typeof BOOST_PRODUCTS;
export const BOOST_PRODUCTS = {
	["x2 Currency"]: 1,
	["x2 Rank Experience"]: 1,
	["x2 Talisman Experience"]: 1,
	["x2 Pet Experience"]: 1,
	["x2 Hatching Luck"]: 1,
};

export const PURCHASE_PET_TEAM_PRODUCT = 1;
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
