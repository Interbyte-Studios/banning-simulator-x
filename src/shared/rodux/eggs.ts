import Rodux from "@rbxts/rodux";
import { getPetData } from "shared/util/getPetData";

import { AddPet } from "./pets";

interface EggsHatched {
	eggsHatched: number;
	basicHatched: number;
	ordinaryHatched: number;
	rareHatched: number;
	primordialHatched: number;
	prismaticHatched: number;
}

export type EggsState = EggsHatched;

const defaultEggs: EggsHatched = {
	eggsHatched: 0,
	basicHatched: 0,
	ordinaryHatched: 0,
	rareHatched: 0,
	primordialHatched: 0,
	prismaticHatched: 0,
};

/* eslint-disable jsdoc/require-jsdoc */
export const eggsReducer = Rodux.createReducer<EggsState, AddPet>(defaultEggs, {
	addPet: (state, action) => {
		const petData = getPetData(action.eggName, action.id);

		const newState: EggsHatched = { ...state };
		newState.eggsHatched += 1;
		newState[`${string.lower(petData.petData.rarity)}Hatched` as keyof EggsHatched] += 1;

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
