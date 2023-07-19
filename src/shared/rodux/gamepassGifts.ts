import Rodux from "@rbxts/rodux";
import { Gamepasses } from "shared/configs/game";

export type GamepassGiftsState = { [P in Gamepasses]: number };
export type GamepassGiftsActions = ClaimGamepassGift | UseGamepassGift;

interface ClaimGamepassGift extends Rodux.Action<"claimGamepassGift"> {
	name: Gamepasses;
}

interface UseGamepassGift extends Rodux.Action<"useGamepassGift"> {
	name: Gamepasses;
}

/**
 * @param gamepassName The name of the gamepass that's being claimed.
 * @returns The Rodux action to dispatch.
 */
export function claimGamepassGift(gamepassName: Gamepasses): ClaimGamepassGift & Rodux.AnyAction {
	return {
		type: "claimGamepassGift",
		name: gamepassName,
	};
}

/**
 * @param gamepassName The name of the gamepass that's being claimed.
 * @returns The Rodux action to dispatch.
 */
export function useGamepassGift(gamepassName: Gamepasses): UseGamepassGift & Rodux.AnyAction {
	return {
		type: "useGamepassGift",
		name: gamepassName,
	};
}

export const defaultGamepassGifts: GamepassGiftsState = {
	["x2 Luck"]: 0,
	["Triple Hatch"]: 0,
	["Fast Hatch"]: 0,
	["x2 Currency"]: 0,
	["x2 Experience"]: 0,
	["Better Fusion"]: 0,
	VIP: 0,
	["+800 Inventory"]: 0,
	["+450 Inventory"]: 0,
	["+250 Inventory"]: 0,
	["+2 Pets Equipped"]: 0,
	["+3 Pets Equipped"]: 0,
	Teleportation: 0,
	["Auto Fight"]: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const gamepassGiftsReducer = Rodux.createReducer<GamepassGiftsState, GamepassGiftsActions>(
	defaultGamepassGifts,
	{
		claimGamepassGift: (state, action) => {
			return {
				...state,
				[action.name]: state[action.name] + 1,
			};
		},
		useGamepassGift: (state, action) => {
			return {
				...state,
				[action.name]: state[action.name] - 1,
			};
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
