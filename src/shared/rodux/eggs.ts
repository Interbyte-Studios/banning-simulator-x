import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { Rarities } from "shared/configs/rarities";
import { getPetData } from "shared/util/getPetData";

import { HatchedPet } from "./pets";

export interface EggsState {
	eggs: number;
	rarities: { [P in Rarities]: number };
}
export type EggsActions = HatchEgg;

export interface HatchEgg extends Rodux.Action<"hatchEgg"> {
	pets: Array<HatchedPet>;
	cost: number;
	currencyType: Currency;
}

/**
 * Hatches a new egg, incrementing its hatch counter, adding the pets to inventory, and removing the specified currency.
 *
 * @param cost The cost of the egg.
 * @param currencyType The currency used to pay for the egg.
 * @param pets The pets to add.
 * @returns The Rodux action to dispatch.
 */
export function hatchEgg(cost: number, currencyType: Currency, pets: Array<HatchedPet>): HatchEgg & Rodux.AnyAction {
	return {
		type: "hatchEgg",
		cost,
		currencyType,
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
		Secret: 0,
		Exclusive: 0,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const eggsReducer = Rodux.createReducer<EggsState, EggsActions>(defaultEggs, {
	hatchEgg: (state, action) => {
		const newRarities = { ...state.rarities };

		for (const pet of action.pets) {
			const petData = getPetData(pet.id);

			newRarities[petData.rarity] += 1;
		}

		return {
			eggs: state.eggs + action.pets.size(),
			rarities: newRarities,
		};
	},
});
/* eslint-enable jsdoc/require-jsdoc */
