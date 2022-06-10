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

const defaultSettings: GamepassesState = {
	"+3 Pets": false,
	"+2 Pets": false,
	"+250 Inventory Slots": false,
	"+450 Inventory Slots": false,
	VIP: false,
	"x2 Currency": false,
	"Auto Open": false,
	"x3 Egg Open": false,
	"x2 Hatch Speed": false,
	"x2 Luck": false,
	Teleportation: false,
};

/* eslint-disable jsdoc/require-jsdoc */
export const gamepassesReducer = Rodux.createReducer<GamepassesState, GamepassActions>(defaultSettings, {
	claimGamepass: (state, action) => {
		const newState = { ...state };
		newState[action.name] = true;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
