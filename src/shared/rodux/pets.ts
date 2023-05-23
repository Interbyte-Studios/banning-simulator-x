import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { EnhancePetMetadata } from "shared/configs/enchantments";
import { PET_LEVEL_REQUIREMENTS, PET_MAX_LEVELS, Variants } from "shared/configs/pets";

import { KillNpc } from "./currencies";
import { RedeemCode } from "./media";
import { RedeemQuest } from "./quests";

export interface Pet {
	id: number;
	bans: number;
	guid: string;
	equipped: boolean;
	locked: boolean;
	variant: Variants;
	tradeLocked: boolean;
	//enhancements: { [slot in Variants]?: Omit<EnhancePetMetadata, "variant"> };
}

export type PetsState = Array<Pet>;
export type PetsActions = AddPet | DeletePet | EnhancePet | EquipPet | LockPet | Admin_ModifyPetLevel;

export interface ConfirmedPet extends PetData {
	autoDeleted: boolean;
	guid: string;
}

export type PetAttainMethod = "maxLevel" | "fuse" | "hatch" | "admin" | "trade";
export interface PetData {
	id: number;
	variant: Variants;
	//enhancements?: { [slot in Variants]?: Omit<EnhancePetMetadata, "variant"> };
	method: PetAttainMethod;
	tradeLocked: boolean;
}

export interface AddPet extends Rodux.Action<"addPet"> {
	cost: number;
	currencyType: Currency;
	pets: Array<ConfirmedPet>;
}

export interface DeletePet extends Rodux.Action<"deletePet"> {
	pets: Array<string>;
}

export interface EquipPet extends Rodux.Action<"equipPets"> {
	pets: Array<{ guid: string; enabled: boolean }>;
	unequipAll: boolean;
}

export interface LockPet extends Rodux.Action<"lockPets"> {
	pets: Array<{ guid: string; enabled: boolean }>;
}

export interface EnhancePet extends Rodux.Action<"enhancePet"> {
	guid: string;
	enhancementData: EnhancePetMetadata;
	cost: number;
}

export interface Admin_ModifyPetLevel extends Rodux.Action<"admin_ModifyPetLevel"> {
	guid: string;
	id: number;
	variant: Variants;
	level: number;
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
		cost,
		currencyType,
		pets,
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

/**
 * @param pets The pets to equip.
 * @param unequipAll Whether or not all equipped pets should be unequipped before the new pets are equipped.
 * @returns The Rodux action to dispatch.
 */
export function equipPets(
	pets: Array<{ guid: string; enabled: boolean }>,
	unequipAll: boolean,
): EquipPet & Rodux.AnyAction {
	return {
		type: "equipPets",
		pets,
		unequipAll,
	};
}

/**
 * @param pets The pets to lock.
 * @returns The Rodux action to dispatch.
 */
export function lockPets(pets: Array<{ guid: string; enabled: boolean }>): LockPet & Rodux.AnyAction {
	return {
		type: "lockPets",
		pets,
	};
}

/**
 * @param guid The guid of the pet.
 * @param enhancementData The metadata of the enhancement.
 * @param cost The cost of the enhancement procedure.
 * @returns The Rodux action to dispatch.
 */
export function enhancePet(
	guid: string,
	enhancementData: EnhancePetMetadata,
	cost: number,
): EnhancePet & Rodux.AnyAction {
	return {
		type: "enhancePet",
		guid,
		enhancementData,
		cost,
	};
}

/**
 * Modifies the level of a pet.
 *
 * @param guid The guid of the pet to modify.
 * @param id The id of the pet.
 * @param variant The variant of the pet.
 * @param level The level to set the pet to.
 * @returns The Rodux action to dispatch.
 */
export function admin_ModifyPetLevel(
	guid: string,
	id: number,
	variant: Variants,
	level: number,
): Admin_ModifyPetLevel & Rodux.AnyAction {
	return {
		type: "admin_ModifyPetLevel",
		guid,
		id,
		variant,
		level,
	};
}

export const defaultPets: PetsState = [];
/*
for (let i = 1; i <= 43; i++) {
	const pet: Pet = {
		id: i,
		guid: `Regular-${tostring(i)}`,
		equipped: false,
		locked: false,
		variant: "regular",
		bans: 600,
		enhancements: {},
	};

	const voidPet: Pet = {
		id: i,
		guid: `Void-${tostring(i)}`,
		equipped: false,
		locked: false,
		variant: "void",
		bans: 1200,
		enhancements: {},
	};

	const radiantPet: Pet = {
		id: i,
		guid: `Radiant-${tostring(i)}`,
		equipped: false,
		locked: false,
		variant: "radiant",
		bans: 2000,
		enhancements: {},
	};

	defaultPets.push(pet);
	defaultPets.push(voidPet);
	defaultPets.push(radiantPet);
}
*/

/* eslint-disable jsdoc/require-jsdoc */
export const petsReducer = Rodux.createReducer<PetsState, PetsActions | RedeemQuest | RedeemCode | KillNpc>(
	defaultPets,
	{
		addPet: (state, action) => {
			const newState: PetsState = [...state];

			for (const pet of action.pets) {
				if (pet.autoDeleted) {
					continue;
				}

				const newPet: Pet = {
					id: pet.id,
					bans: 1,
					guid: pet.guid,
					equipped: false,
					locked: false,
					variant: pet.variant,
					tradeLocked: pet.tradeLocked,
					//enhancements: pet.enhancements ?? {},
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
		equipPets: (state, action) => {
			const newState = [...state];

			if (action.unequipAll) {
				for (const pet of newState) {
					if (pet.equipped === false) {
						continue;
					}

					pet.equipped = false;
				}
			}

			for (const petToEquip of action.pets) {
				const storedPet = newState.find((pet) => pet.guid === petToEquip.guid);
				assert(storedPet, `Rodux failed to equip pet with guid: "${petToEquip.guid}"`);

				storedPet.equipped = petToEquip.enabled;
			}

			return newState;
		},
		lockPets: (state, action) => {
			const newState = [...state];

			for (const petToEquip of action.pets) {
				const storedPet = newState.find((pet) => pet.guid === petToEquip.guid);
				assert(storedPet, `Rodux failed to equip pet with guid: "${petToEquip.guid}"`);

				storedPet.locked = petToEquip.enabled;
			}

			return newState;
		},
		enhancePet: (state, action) => {
			const newState = [...state];

			const pet = newState.find((pet) => pet.guid === action.guid);
			if (pet !== undefined) {
				//pet.enhancements[action.enhancementData.variant] = action.enhancementData;
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
					bans: 1,
					guid,
					equipped: false,
					locked: false,
					tradeLocked: false,
					variant,
					enhancements: {},
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
					bans: 1,
					guid,
					equipped: false,
					locked: false,
					tradeLocked: false,
					variant,
					enhancements: {},
				},
			];
		},
		killNpc: (state, action) => {
			const newState = [...state];

			for (const pet of newState) {
				if (!pet.equipped) {
					continue;
				}

				pet.bans += 1 * math.ceil(action.petExperienceMultiplier);
			}

			return newState;
		},
		admin_ModifyPetLevel: (state, action) => {
			const newState = [...state];

			const pet = newState.find((pet) => pet.guid === action.guid);
			if (pet !== undefined) {
				const desiredLevels = action.level < PET_MAX_LEVELS[pet.variant] ? action.level : PET_MAX_LEVELS[pet.variant];
				const banResult = PET_LEVEL_REQUIREMENTS[pet.variant] * desiredLevels;

				pet.bans = banResult;
			}

			return newState;
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
