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

export const defaultEggs: EggsState = {
	eggs: 0,
	rarities: {
		Basic: 0,
		Ordinary: 0,
		Rare: 0,
		Epic: 0,
		Legendary: 0,
		Primordial: 0,
		Prismatic: 0,
		Exclusive: 0,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const eggsReducer = Rodux.createReducer<EggsState, EggsActions>(defaultEggs, {
	addEgg: (state, action) => {
		const newEggAmount = state.eggs + action.pets.size();
		const newRarities = {
			Basic: 0,
			Ordinary: 0,
			Rare: 0,
			Epic: 0,
			Legendary: 0,
			Primordial: 0,
			Prismatic: 0,
			Exclusive: 0,
		};

		for (const pet of action.pets) {
			const petData = getPetData(pet.id);

			newRarities[petData.rarity] += 1;
		}

		return {
			eggs: newEggAmount,
			rarities: {
				Basic: state.rarities.Basic + newRarities.Basic,
				Ordinary: state.rarities.Ordinary + newRarities.Ordinary,
				Rare: state.rarities.Rare + newRarities.Rare,
				Epic: state.rarities.Epic + newRarities.Epic,
				Legendary: state.rarities.Legendary + newRarities.Legendary,
				Primordial: state.rarities.Primordial + newRarities.Primordial,
				Prismatic: state.rarities.Prismatic + newRarities.Prismatic,
				Exclusive: state.rarities.Exclusive + newRarities.Exclusive,
			},
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
