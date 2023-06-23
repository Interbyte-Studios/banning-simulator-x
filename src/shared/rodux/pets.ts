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

export type PetAttainMethod = "maxLevel" | "fuse" | "hatch" | "admin" | "trade" | "purchase";
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
			const newPets = action.pets
				.filter((pet) => !pet.autoDeleted)
				.map((pet) => {
					return {
						id: pet.id,
						bans: 0,
						guid: pet.guid,
						equipped: false,
						locked: false,
						variant: pet.variant,
						tradeLocked: pet.tradeLocked,
					};
				});

			return [...state, ...newPets];
		},
		deletePet: (state, action) => {
			return state.filter((pet) => !action.pets.includes(pet.guid));
		},
		equipPets: (state, action) => {
			return state.map((pet) => {
				const shouldBeEquipped = action.pets.some((p) => p.guid === pet.guid && p.enabled);
				const shouldBeUnequipped = action.unequipAll || action.pets.some((p) => p.guid === pet.guid && !p.enabled);

				if (shouldBeEquipped) {
					return { ...pet, equipped: true };
				} else if (shouldBeUnequipped) {
					return { ...pet, equipped: false };
				}

				return pet;
			});
		},
		lockPets: (state, action) => {
			const newState = state.map((pet) => {
				const petToLock = action.pets.find((p) => p.guid === pet.guid);
				if (petToLock) {
					return { ...pet, locked: petToLock.enabled };
				}
				return pet;
			});

			return newState;
		},
		enhancePet: (state) => {
			return state;
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
			const newState = state.map((pet) => {
				if (!pet.equipped) {
					return pet;
				}

				return { ...pet, bans: pet.bans + 1 * math.ceil(action.petExperienceMultiplier) };
			});

			return newState;
		},
		admin_ModifyPetLevel: (state, action) => {
			const newState = state.map((pet) => {
				if (pet.guid !== action.guid) {
					return pet;
				}

				const desiredLevels = action.level < PET_MAX_LEVELS[pet.variant] ? action.level : PET_MAX_LEVELS[pet.variant];
				const banResult = PET_LEVEL_REQUIREMENTS[pet.variant] * desiredLevels;

				return { ...pet, bans: banResult };
			});

			return newState;
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
