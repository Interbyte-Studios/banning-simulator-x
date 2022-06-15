import Rodux from "@rbxts/rodux";
import { Rarities } from "shared/configs/rarities";
import { getPetData } from "shared/util/getPetData";

import { AddPet } from "./pets";

export interface EggsState {
	eggs: number;
	specifics: { [P in Rarities]: number };
}

const defaultEggs: EggsState = {
	eggs: 0,
	specifics: {
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
		const petData = getPetData(action.eggName, action.id);

		const newState = { ...state };
		newState.eggs += 1;
		newState.specifics[petData.petData.rarity] += 1;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
