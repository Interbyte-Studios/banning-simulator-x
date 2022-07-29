export const MAIN_GROUP = 5126818;

export type Gamepasses = keyof typeof GAMEPASSES;
export const GAMEPASSES = {
	["x2 Luck"]: 1,
	["Fast Hatch"]: 1,
	["x3 Eggs Hatched"]: 1,
	["x2 Currency"]: 1,
	["x2 Experience"]: 1,
	["x2 Fusion Luck"]: 1,
	["Extra Drops"]: 1,
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
	["x2 Boss Drop Luck"]: 1,
	["x2 Currency"]: 1,
	["x2 Experience"]: 1,
	["x2 Pet Experience"]: 1,
};

export type TaskProducts = keyof typeof TASK_PRODUCTS;
export const TASK_PRODUCTS = {
	Regular: 1,
	Void: 1,
	Radiant: 1,
};
