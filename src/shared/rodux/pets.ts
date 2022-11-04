import Rodux from "@rbxts/rodux";
import { HttpService } from "@rbxts/services";
import { Currency } from "shared/configs/currencies";
import { Variants } from "shared/configs/pets";
import { Rarities } from "shared/configs/rarities";

import { RedeemCode } from "./media";
import { RedeemQuest } from "./quests";

export interface Pet {
	id: number;
	guid: string;
	equipped: boolean;
	locked: boolean;
	variant: Variants;
	enhancements: [];
}

export type PetsState = Array<Pet>;
export type PetsActions = AddPet | DeletePet;

export interface ConfirmedPet extends PetData {
	autoDeleted: boolean;
}

export interface PetData {
	id: number;
	rarity: Rarities;
	variant: Variants;
}

export interface AddPet extends Rodux.Action<"addPet"> {
	cost: number;
	currencyType: Currency;
	pets: Array<ConfirmedPet>;
}

export interface DeletePet extends Rodux.Action<"deletePet"> {
	pets: Array<string>;
}

/**
 * @param cost The cost of the egg hatch.
 * @param currencyType The type of currency the eggs were purchased with.
 * @param pets The pets to add.
 * @returns The Rodux action to dispatch.
 */
export function addPets(cost: number, currencyType: Currency, pets: Array<ConfirmedPet>): AddPet & Rodux.AnyAction {
	return {
		type: "addPet",
		cost: cost,
		currencyType: currencyType,
		pets: pets,
	};
}

/**
 * @param pets The pets to remove.
 * @returns The Rodux action to dispatch.
 */
export function deletePets(pets: Array<string>): DeletePet & Rodux.AnyAction {
	return {
		type: "deletePet",
		pets,
	};
}

const defaultPets: PetsState = [];

for (let x = 1; x <= 6; x++) {
	for (let i = 1; i <= 81; i++) {
		const pet: Pet = {
			id: i,
			guid: tostring(i),
			equipped: false,
			locked: false,
			variant: "regular",
			enhancements: [],
		};

		const voidPet: Pet = {
			id: i,
			guid: tostring(i),
			equipped: false,
			locked: false,
			variant: "void",
			enhancements: [],
		};

		const radiantPet: Pet = {
			id: i,
			guid: tostring(i),
			equipped: false,
			locked: false,
			variant: "radiant",
			enhancements: [],
		};

		defaultPets.push(pet);
		defaultPets.push(voidPet);
		defaultPets.push(radiantPet);
	}
}

/* eslint-disable jsdoc/require-jsdoc */
export const petsReducer = Rodux.createReducer<PetsState, PetsActions | RedeemQuest | RedeemCode>(defaultPets, {
	addPet: (state, action) => {
		const newState: PetsState = [...state];

		for (const pet of action.pets) {
			if (pet.autoDeleted) {
				continue;
			}

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
	deletePet: (state, action) => {
		const newState = [...state];

		for (const petToDelete of action.pets) {
			newState.unorderedRemove(newState.findIndex((pet) => pet.guid === petToDelete));
		}

		return newState;
	},
	redeemQuest: (state, action) => {
		if (action.rewardType.kind !== "pet") {
			return state;
		}

		const { id, guid, variant } = action.rewardType;

		return [
			...state,
			{
				id,
				guid,
				equipped: false,
				locked: false,
				variant,
				enhancements: [],
			},
		];
	},
	redeemCode: (state, action) => {
		if (action.pet === undefined) {
			return state;
		}

		const { id, guid, variant } = action.pet;

		return [
			...state,
			{
				id,
				guid,
				equipped: false,
				locked: false,
				variant,
				enhancements: [],
			},
		];
	},
});
/* eslint-enable jsdoc/require-jsdoc */
