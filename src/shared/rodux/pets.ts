import Rodux from "@rbxts/rodux";
import { HttpService } from "@rbxts/services";
import { Currency } from "shared/configs/currencies";
import { Variants } from "shared/configs/pets";
import { Rarities } from "shared/configs/rarities";

export interface Pet {
	id: number;
	guid: string;
	equipped: boolean;
	locked: boolean;
	variant: Variants;
	enhancements: [];
}

export type PetsState = Array<Pet>;
export type PetsActions = AddPet;

export interface PetData {
	id: number;
	rarity: Rarities;
	variant: Variants;
}

export interface AddPet extends Rodux.Action<"addPet"> {
	cost: number;
	currencyType: Currency;
	pets: Array<PetData>;
}

/**
 * @param cost The cost of the egg hatch.
 * @param currencyType The type of currency the eggs were purchased with.
 * @param pets The pets to add.
 * @returns The Rodux action to dispatch.
 */
export function addPets(cost: number, currencyType: Currency, pets: Array<PetData>): AddPet & Rodux.AnyAction {
	return {
		type: "addPet",
		cost: cost,
		currencyType: currencyType,
		pets: pets,
	};
}

const defaultPets: PetsState = [];

/* eslint-disable jsdoc/require-jsdoc */
export const petsReducer = Rodux.createReducer<PetsState, PetsActions>(defaultPets, {
	addPet: (state, action) => {
		const newState: PetsState = [...state];

		for (const pet of action.pets) {
			const petGuid = HttpService.GenerateGUID(false);
			const newPet: Pet = {
				id: pet.id,
				guid: petGuid,
				equipped: false,
				locked: false,
				variant: pet.variant,
				enhancements: [],
			};

			newState.push(newPet);
		}
		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
