import Rodux from "@rbxts/rodux";
import { Gamepasses } from "shared/configs/game";

export type GamepassesState = { [P in Gamepasses]: boolean };
export type GamepassActions = ClaimGamepass;

interface ClaimGamepass extends Rodux.Action<"claimGamepass"> {
	name: Gamepasses;
}

/**
 *
 * @param gamepassName The name of the gamepass that's being claimed.
 * @returns The Rodux action to dispatch.
 */
export function claimGamepass(gamepassName: Gamepasses): ClaimGamepass & Rodux.AnyAction {
	return {
		type: "claimGamepass",
		name: gamepassName,
	};
}

export const defaultGamepasses: GamepassesState = {
	["x2 Luck"]: false,
	["Triple Hatch"]: false,
	["Fast Hatch"]: false,
	["x2 Currency"]: false,
	["x2 Experience"]: false,
	["Better Fusion"]: false,
	VIP: false,
	["+800 Inventory"]: false,
	["+450 Inventory"]: false,
	["+250 Inventory"]: false,
	["+2 Pets Equipped"]: false,
	["+3 Pets Equipped"]: false,
	Teleportation: false,
	["Auto Fight"]: false,
};

/* eslint-disable jsdoc/require-jsdoc */
export const gamepassesReducer = Rodux.createReducer<GamepassesState, GamepassActions>(defaultGamepasses, {
	claimGamepass: (state, action) => {
		const newState = { ...state };
		newState[action.name] = true;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
