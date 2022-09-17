import Rodux from "@rbxts/rodux";
import { Rarities } from "shared/configs/rarities";

export type ImmuneRarities = "Legendary" | "Prismatic" | "Primordial";
export interface AutoDeleteState {
	rarities: {
		[rarity in Exclude<Rarities, ImmuneRarities>]: boolean;
	};
	easyLegendaries: boolean;
}
export type AutoDeleteActions = ToggleRarityDelete | ToggleEasyLegendariesDelete;

export interface ToggleRarityDelete extends Rodux.Action<"toggleRarityDelete"> {
	rarity: Exclude<Rarities, ImmuneRarities>;
}

export interface ToggleEasyLegendariesDelete extends Rodux.Action<"toggleEasyLegendariesDelete"> {}

/**
 * Toggles the auto delete status of a specified rarity.
 *
 * @param rarity The rarity to toggle the delete status of.
 * @returns The Rodux action to dispatch.
 */
export function toggleRarityDelete(rarity: Exclude<Rarities, ImmuneRarities>): ToggleRarityDelete & Rodux.AnyAction {
	return {
		type: "toggleRarityDelete",
		rarity,
	};
}

/**
 * Toggles the auto delete status of easy legendaries.
 *
 * @returns The Rodux action to dispatch.
 */
export function toggleEasyLegendariesDelete(): ToggleEasyLegendariesDelete & Rodux.AnyAction {
	return {
		type: "toggleEasyLegendariesDelete",
	};
}

const defaultState: AutoDeleteState = {
	rarities: {
		Basic: false,
		Ordinary: false,
		Rare: false,
		Epic: false,
	},
	easyLegendaries: false,
};

/* eslint-disable jsdoc/require-jsdoc */
export const autoDeleteReducer = Rodux.createReducer<AutoDeleteState, AutoDeleteActions>(defaultState, {
	toggleEasyLegendariesDelete: (state) => {
		return {
			...state,
			easyLegendaries: !state.easyLegendaries,
		};
	},
	toggleRarityDelete: (state, action) => {
		const newState = { ...state };
		newState.rarities[action.rarity] = !state.rarities[action.rarity];

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
