import Rodux from "@rbxts/rodux";
import { Rarities } from "shared/configs/rarities";
import { getPetData } from "shared/util/getPetData";

import { ConfirmedPet } from "./pets";

export interface EggsState {
	eggs: number;
	rarities: { [P in Rarities]: number };
}
export type EggsActions = AddEgg;

export interface AddEgg extends Rodux.Action<"addEgg"> {
	pets: Array<ConfirmedPet>;
}

/**
 * @param pets The pets to add.
 * @returns The Rodux action to dispatch.
 */
export function addEgg(pets: Array<ConfirmedPet>): AddEgg & Rodux.AnyAction {
	return {
		type: "addEgg",
		pets,
	};
}

const defaultEggs: EggsState = {
	eggs: 0,
	rarities: {
		Basic: 0,
		Ordinary: 0,
		Rare: 0,
		Epic: 0,
		Legendary: 0,
		Primordial: 0,
		Prismatic: 0,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const eggsReducer = Rodux.createReducer<EggsState, EggsActions>(defaultEggs, {
	addEgg: (state, action) => {
		const newState = { ...state };

		for (const pet of action.pets) {
			const petData = getPetData(pet.id);

			newState.eggs += 1;
			newState.rarities = {
				...newState.rarities,
				[petData.rarity]: newState.rarities[petData.rarity] + 1,
			};
		}

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
