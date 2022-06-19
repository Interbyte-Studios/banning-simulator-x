import Rodux from "@rbxts/rodux";
import { Rarities } from "shared/configs/rarities";

import { AddPet } from "./pets";

export interface EggsState {
	eggs: number;
	rarities: { [P in Rarities]: number };
}

const defaultEggs: EggsState = {
	eggs: 0,
	rarities: {
		Basic: 0,
		Ordinary: 0,
		Rare: 0,
		Legendary: 0,
		Primordial: 0,
		Prismatic: 0,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const eggsReducer = Rodux.createReducer<EggsState, AddPet>(defaultEggs, {
	addPet: (state, action) => {
		const newState = { ...state };

		for (const pet of action.pets) {
			newState.eggs += 1;
			newState.rarities[pet.rarity] += 1;
		}

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
