import Rodux from "@rbxts/rodux";
import { PET_MAX_LEVELS } from "shared/configs/pets";
import { getPetExtraBans, getPetLevel } from "shared/util/getPetLevel";

import { KillNpc } from "../currencies";
import { HatchEgg } from "../eggs";
import { AddPets, Admin_ModifyPetLevel, FusePet } from "../pets";

export type PetIndexState = Map<
	number,
	{
		hatched: {
			regular: number;
			void: number;
		};
		fused: {
			void: number;
			radiant: number;
		};
		maxLevel: {
			regular: {
				amount: number;
				cachedMaxLevel: Set<string>;
			};
			void: {
				amount: number;
				cachedMaxLevel: Set<string>;
			};
			radiant: {
				amount: number;
				cachedMaxLevel: Set<string>;
			};
		};
	}
>;

type InternalPetIndexState = PetIndexState extends Map<unknown, infer T> ? T : never;
export type SerializedPetIndexState = Array<
	{
		petId: number;
	} & InternalPetIndexState
>;

const defaultPetData: PetIndexState extends Map<unknown, infer T> ? T : never = {
	hatched: {
		regular: 0,
		void: 0,
	},
	fused: {
		void: 0,
		radiant: 0,
	},
	maxLevel: {
		regular: {
			amount: 0,
			cachedMaxLevel: new Set(),
		},
		void: {
			amount: 0,
			cachedMaxLevel: new Set(),
		},
		radiant: {
			amount: 0,
			cachedMaxLevel: new Set(),
		},
	},
};

/**
 * Runs the pet reducer against a specified action in which pets are potentially changing levels.
 *
 * @param state The current state of the pet index.
 * @param action The action that is being ran.
 * @returns The new state of the pet index.
 */
function petReducer(state: PetIndexState, action: KillNpc | Admin_ModifyPetLevel): PetIndexState {
	const newState = new Map([...state]);

	const affectedPets = action.type === "killNpc" ? action.equippedPets : [action];
	const extraBans = action.type === "killNpc" ? getPetExtraBans(action.petExperienceMultiplier) : 0;

	for (const pet of affectedPets) {
		const petData = newState.get(pet.id) ?? defaultPetData;

		const maxLevel = PET_MAX_LEVELS[pet.variant];

		// we need to add on the bans we get for this kill
		// if it was a kill action
		const petWithBans = {
			...pet,
			// if it was a killNpc action, we are safe to cast the pet as a Pet type
			// otherwise, we will override the pet level anyway
			// so just set it to zero
			bans: action.type === "killNpc" ? (pet as KillNpc["equippedPets"][number]).bans + extraBans : 0,
		};

		const petLevel =
			action.type === "killNpc" ? getPetLevel(petWithBans as KillNpc["equippedPets"][number]) : action.level;
		if (petLevel < maxLevel) {
			continue;
		}

		const wasNewPet = !petData.maxLevel[pet.variant].cachedMaxLevel.has(pet.guid);
		if (wasNewPet) {
			// we need to add this pet to the mastery
			petData.maxLevel = {
				...petData.maxLevel,
				[pet.variant]: {
					amount: petData.maxLevel[pet.variant].amount + 1,
					cachedMaxLevel: new Set([...petData.maxLevel[pet.variant].cachedMaxLevel, pet.guid]),
				},
			};
		}
	}

	return newState;
}

export const defaultPetIndexReducerState: PetIndexState = new Map();

/* eslint-disable jsdoc/require-jsdoc */
export const petIndexReducer = Rodux.createReducer<
	PetIndexState,
	HatchEgg | KillNpc | Admin_ModifyPetLevel | FusePet | AddPets
>(defaultPetIndexReducerState, {
	hatchEgg: (state, action) => {
		const newState = new Map([...state]);

		for (const { id, variant } of action.pets) {
			const pet = newState.get(id) ?? defaultPetData;
			pet.hatched = {
				...pet.hatched,
				[variant]: pet.hatched[variant] + 1,
			};

			newState.set(id, pet);
		}

		return newState;
	},
	addPets: (state, action) => {
		const newState = new Map([...state]);

		for (const { id, variant } of action.pets) {
			if (variant === "radiant") {
				continue;
			}

			const pet = newState.get(id) ?? defaultPetData;
			print(`${variant} ${id}: ${pet.hatched[variant]}`);

			pet.hatched = {
				...pet.hatched,
				[variant]: pet.hatched[variant] + 1,
			};

			newState.set(id, pet);
		}

		return newState;
	},
	fusePet: (state, action) => {
		const newState = new Map([...state]);

		const { id, variant } = action.pet;
		const pet = newState.get(id) ?? defaultPetData;

		pet.fused = {
			...pet.fused,
			[variant]: pet.fused[variant] + 1,
		};
		newState.set(id, pet);
		return newState;
	},
	killNpc: petReducer,
	admin_ModifyPetLevel: petReducer,
});
/* eslint-enable jsdoc/require-jsdoc */

/**
 *
 * @param state The state of the pet index.
 * @returns A serialized state which can later be deserialized.
 */
export function serializePetIndexState(state: PetIndexState): SerializedPetIndexState {
	return [...state].map(([petId, petIndexData]) => ({
		petId,
		...petIndexData,
	}));
}

/**
 *
 * @param state The serialized state of the pet index.
 * @returns The deserialized state of the pet index.
 */
export function deserializePetIndexState(state: SerializedPetIndexState): PetIndexState {
	return new Map(
		state.map((serializedData) => {
			const petId = serializedData.petId;

			// remove petId from serialized data
			serializedData.petId = undefined as unknown as number;

			return [petId, serializedData];
		}),
	);
}
