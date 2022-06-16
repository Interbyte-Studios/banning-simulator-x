import Rodux from "@rbxts/rodux";
import { HttpService } from "@rbxts/services";
import { EggName } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";

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

interface PetData {
	id: number;
	variant: Variants;
}

export interface AddPet extends Rodux.Action<"addPet"> {
	pets: Array<PetData>;
}

/**
 * @param pets The pets to add.
 * @returns The Rodux action to dispatch.
 */
export function addPets(pets: Array<PetData>): AddPet & Rodux.AnyAction {
	return {
		type: "addPet",
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
