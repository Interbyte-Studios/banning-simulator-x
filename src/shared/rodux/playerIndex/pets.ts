import Rodux from "@rbxts/rodux";
import { Variants } from "shared/configs/pets";

import { HatchEgg } from "../eggs";
import { AddPets, FusePet } from "../pets";

export type PetMasteryData = {
	hatched: {
		regular: number;
		void: number;
	};
	fused: {
		void: number;
		radiant: number;
	};
	maxLevel: {
		regular: number;
		void: number;
		radiant: number;
	};
};
export type MainPetMasteryData = {
	id: number;
	index: PetMasteryData;
};

export type PetIndexState = Array<MainPetMasteryData>;
export type PetIndexActions = LogPetMaxLevel;

interface LogPetMaxLevel extends Rodux.Action<"logPetMaxLevel"> {
	pets: Array<{ id: number; variant: Variants }>;
}

/**
 * @param pets The pets.
 * @returns The Rodux action to dispatch.
 */
export function logPetMaxLevel(pets: Array<{ id: number; variant: Variants }>): LogPetMaxLevel & Rodux.AnyAction {
	return {
		type: "logPetMaxLevel",
		pets,
	};
}

export const defaultPetIndexReducerState: PetIndexState = [];

/* eslint-disable jsdoc/require-jsdoc */
export const petIndexReducer = Rodux.createReducer<PetIndexState, PetIndexActions | HatchEgg | FusePet | AddPets>(
	defaultPetIndexReducerState,
	{
		hatchEgg: (state, action) => {
			const newState = [...state];

			for (const { id, variant } of action.pets) {
				if (variant === "radiant") {
					continue;
				}

				const pet = newState.find((index) => index.id === id);
				const petIndex = newState.findIndex((index) => index.id === id);
				if (pet !== undefined && petIndex !== -1) {
					newState[petIndex] = {
						...pet,
						index: {
							...pet.index,
							hatched: {
								...pet.index.hatched,
								[variant]: pet.index.hatched[variant] + 1,
							},
						},
					};
				} else {
					const newPet = {
						id,
						index: {
							hatched: {
								regular: variant === "regular" ? 1 : 0,
								void: variant === "void" ? 1 : 0,
							},
							fused: {
								void: 0,
								radiant: 0,
							},
							maxLevel: {
								regular: 0,
								void: 0,
								radiant: 0,
							},
						},
					};
					newState.push(newPet);
				}
			}

			return newState;
		},
		addPets: (state, action) => {
			const newState = [...state];

			for (const { id, variant } of action.pets) {
				if (variant === "radiant") {
					continue;
				}

				const pet = newState.find((index) => index.id === id);
				const petIndex = newState.findIndex((index) => index.id === id);
				if (pet !== undefined && petIndex !== -1) {
					newState[petIndex] = {
						...pet,
						index: {
							...pet.index,
							hatched: {
								...pet.index.hatched,
								[variant]: pet.index.hatched[variant] + 1,
							},
						},
					};
				} else {
					const newPet = {
						id,
						index: {
							hatched: {
								regular: variant === "regular" ? 1 : 0,
								void: variant === "void" ? 1 : 0,
							},
							fused: {
								void: 0,
								radiant: 0,
							},
							maxLevel: {
								regular: 0,
								void: 0,
								radiant: 0,
							},
						},
					};
					newState.push(newPet);
				}
			}

			return newState;
		},
		fusePet: (state, action) => {
			const newState = [...state];

			const { id, variant } = action.pet;
			const pet = newState.find((index) => index.id === id);
			const petIndex = newState.findIndex((index) => index.id === id);
			if (pet !== undefined && petIndex !== -1) {
				newState[petIndex] = {
					...pet,
					index: {
						...pet.index,
						fused: {
							...pet.index.fused,
							[variant]: pet.index.fused[variant] + 1,
						},
					},
				};
			} else {
				const newPet = {
					id,
					index: {
						hatched: {
							regular: 0,
							void: 0,
						},
						fused: {
							void: variant === "void" ? 1 : 0,
							radiant: variant === "radiant" ? 1 : 0,
						},
						maxLevel: {
							regular: 0,
							void: 0,
							radiant: 0,
						},
					},
				};
				newState.push(newPet);
			}
			return newState;
		},
		logPetMaxLevel: (state, action) => {
			const newState = [...state];

			for (const { id, variant } of action.pets) {
				const pet = newState.find((index) => index.id === id);
				const petIndex = newState.findIndex((index) => index.id === id);
				if (pet !== undefined && petIndex !== -1) {
					newState[petIndex] = {
						...pet,
						index: {
							...pet.index,
							maxLevel: {
								...pet.index.maxLevel,
								[variant]: pet.index.maxLevel[variant] + 1,
							},
						},
					};
				} else {
					const newPet = {
						id,
						index: {
							hatched: {
								regular: 0,
								void: 0,
							},
							fused: {
								void: 0,
								radiant: 0,
							},
							maxLevel: {
								regular: variant === "regular" ? 1 : 0,
								void: variant === "void" ? 1 : 0,
								radiant: variant === "radiant" ? 1 : 0,
							},
						},
					};
					newState.push(newPet);
				}
			}

			return newState;
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
