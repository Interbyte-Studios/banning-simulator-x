import Rodux from "@rbxts/rodux";
import { HttpService } from "@rbxts/services";
import { EggNames } from "shared/configs/eggs";
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

export interface AddPet extends Rodux.Action<"addPet"> {
	eggName: EggNames;
	id: number;
	variant: Variants;
}

/**
 * @param eggName The name of the egg the pet comes from.
 * @param id The pet id that is being added.
 * @param variant The variant of the pet.
 * @returns The Rodux action to dispatch.
 */
export function addPet(eggName: EggNames, id: number, variant: Variants): AddPet & Rodux.AnyAction {
	return {
		type: "addPet",
		eggName: eggName,
		id: id,
		variant: variant,
	};
}

const defaultPets: PetsState = [];

/* eslint-disable jsdoc/require-jsdoc */
export const petsReducer = Rodux.createReducer<PetsState, PetsActions>(defaultPets, {
	addPet: (state, action) => {
		const newState: PetsState = [...state];

		const petGuid = HttpService.GenerateGUID(false);
		const newPet: Pet = {
			id: action.id,
			guid: petGuid,
			equipped: false,
			locked: false,
			variant: "regular",
			enhancements: [],
		};

		newState.push(newPet);
		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
