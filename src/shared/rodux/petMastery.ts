import Rodux from "@rbxts/rodux";
import { Variants } from "shared/configs/pets";

export type PetMasteryState = Map<
	number,
	{
		[variant in Variants]: { claimed: boolean; cosmeticEnabled: boolean };
	}
>;
export type PetMasteryActions = ClaimMastery | ToggleMasteryCosmetic;

const defaultPlayerIndex: PetMasteryState = new Map();

interface ClaimMastery extends Rodux.Action<"claimMastery"> {
	petId: number;
	variant: Variants;
}

/**
 * @param petId The id of the pet.
 * @param variant The variant of the pet.
 * @returns The Rodux action to dispatch.
 */
export function claimMastery(petId: number, variant: Variants): ClaimMastery & Rodux.AnyAction {
	return {
		type: "claimMastery",
		petId,
		variant,
	};
}

interface ToggleMasteryCosmetic extends Rodux.Action<"toggleMasteryCosmetic"> {
	petId: number;
	variant: Variants;
}

/**
 * @param petId The id of the pet.
 * @param variant The variant of the pet.
 * @returns The Rodux action to dispatch.
 */
export function toggleMasteryCosmetic(petId: number, variant: Variants): ToggleMasteryCosmetic & Rodux.AnyAction {
	return {
		type: "toggleMasteryCosmetic",
		petId,
		variant,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const petMasteryReducer = Rodux.createReducer<PetMasteryState, PetMasteryActions>(defaultPlayerIndex, {
	claimMastery: (state, action) => {
		const newState = new Map([...state]);

		let petMasteryData = newState.get(action.petId);
		if (petMasteryData === undefined) {
			newState.set(action.petId, {
				regular: { claimed: false, cosmeticEnabled: false },
				void: { claimed: false, cosmeticEnabled: false },
				radiant: { claimed: false, cosmeticEnabled: false },
			});

			petMasteryData = newState.get(action.petId);
			assert(
				petMasteryData,
				`Failed to set pet mastery data for pet with id "${action.petId}" of variant "${action.variant}".`,
			);
		}

		petMasteryData[action.variant].claimed = true;
		return newState;
	},
	toggleMasteryCosmetic: (state, action) => {
		const newState = new Map([...state]);

		let petMasteryData = newState.get(action.petId);
		if (petMasteryData === undefined) {
			newState.set(action.petId, {
				regular: { claimed: false, cosmeticEnabled: false },
				void: { claimed: false, cosmeticEnabled: false },
				radiant: { claimed: false, cosmeticEnabled: false },
			});

			petMasteryData = newState.get(action.petId);
			assert(
				petMasteryData,
				`Failed to set pet mastery data for pet with id "${action.petId}" of variant "${action.variant}".`,
			);
		}

		petMasteryData[action.variant].cosmeticEnabled = !petMasteryData[action.variant].cosmeticEnabled;
		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
