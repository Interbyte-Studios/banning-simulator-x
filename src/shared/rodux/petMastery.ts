import Rodux from "@rbxts/rodux";
import { Variants } from "shared/configs/pets";

export type PetMastery = {
	regular: {
		hatchClaimed: boolean;
		maxLevelClaimed: boolean;
	};
	void: {
		hatchClaimed: boolean;
		maxLevelClaimed: boolean;
		fuseClaimed: boolean;
	};
	radiant: {
		maxLevelClaimed: boolean;
		fuseClaimed: boolean;
	};
};
const defaultPetMastery: PetMastery = {
	regular: {
		hatchClaimed: false,
		maxLevelClaimed: false,
	},
	void: {
		hatchClaimed: false,
		maxLevelClaimed: false,
		fuseClaimed: false,
	},
	radiant: {
		maxLevelClaimed: false,
		fuseClaimed: false,
	},
};

export type PetMasteryState = Array<{
	id: number;
	mastery: PetMastery;
}>;
export type PetMasteryActions = ClaimHatchMastery | ClaimMaxLevelMastery | ClaimFuseMastery;
export type PetMasteryChallengeType = "maxLevel" | "hatch" | "fuse";

interface ClaimHatchMastery extends Rodux.Action<"claimHatchMastery"> {
	petId: number;
	// radiant cannot be claimed as a hatch in the mastery
	variant: Exclude<Variants, "radiant">;
}

/**
 * @param petId The id of the pet.
 * @param variant The variant of the pet.
 * @returns The Rodux action to dispatch.
 */
export function claimHatchMastery(
	petId: number,
	variant: Exclude<Variants, "radiant">,
): ClaimHatchMastery & Rodux.AnyAction {
	return {
		type: "claimHatchMastery",
		petId,
		variant,
	};
}

interface ClaimMaxLevelMastery extends Rodux.Action<"claimMaxLevelMastery"> {
	petId: number;
	variant: Variants;
}

/**
 *
 * @param petId The id of the pet.
 * @param variant The variant of the pet.
 * @returns The rodux action to dispatch.
 */
export function claimMaxLevelMastery(petId: number, variant: Variants): ClaimMaxLevelMastery & Rodux.AnyAction {
	return {
		type: "claimMaxLevelMastery",
		petId,
		variant,
	};
}

interface ClaimFuseMastery extends Rodux.Action<"claimFuseMastery"> {
	petId: number;
	variant: Exclude<Variants, "regular">;
}

/**
 *
 * @param petId The id of the pet.
 * @param variant The variant of the pet.
 * @returns The rodux action to dispatch.
 */
export function claimFuseMastery(
	petId: number,
	variant: Exclude<Variants, "regular">,
): ClaimFuseMastery & Rodux.AnyAction {
	return {
		type: "claimFuseMastery",
		petId,
		variant,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const petMasteryReducer = Rodux.createReducer<PetMasteryState, PetMasteryActions>([], {
	claimHatchMastery: (state, action) => {
		const newState = [...state];

		const pet = newState.find((mastery) => mastery.id === action.petId);
		const petIndex = newState.findIndex((mastery) => mastery.id === action.petId);
		if (pet !== undefined && petIndex !== -1) {
			const newPet = {
				...pet,
				mastery: {
					...pet.mastery,
					[action.variant]: {
						...pet.mastery[action.variant],
						hatchClaimed: true,
					},
				},
			};

			newState[petIndex] = newPet;
		} else {
			newState.push({
				id: action.petId,
				mastery: {
					...defaultPetMastery,
					[action.variant]: {
						...defaultPetMastery[action.variant],
						hatchClaimed: true,
					},
				},
			});
		}
		return newState;
	},
	claimMaxLevelMastery: (state, action) => {
		const newState = [...state];

		const pet = newState.find((mastery) => mastery.id === action.petId);
		const petIndex = newState.findIndex((mastery) => mastery.id === action.petId);
		if (pet !== undefined && petIndex !== -1) {
			const newPet = {
				...pet,
				mastery: {
					...pet.mastery,
					[action.variant]: {
						...pet.mastery[action.variant],
						maxLevelClaimed: true,
					},
				},
			};
			newState[petIndex] = newPet;
		} else {
			newState.push({
				id: action.petId,
				mastery: {
					...defaultPetMastery,
					[action.variant]: {
						...defaultPetMastery[action.variant],
						maxLevelClaimed: true,
					},
				},
			});
		}
		return newState;
	},
	claimFuseMastery: (state, action) => {
		const newState = [...state];

		const pet = newState.find((mastery) => mastery.id === action.petId);
		const petIndex = newState.findIndex((mastery) => mastery.id === action.petId);
		if (pet !== undefined && petIndex !== -1) {
			const newPet = {
				...pet,
				mastery: {
					...pet.mastery,
					[action.variant]: {
						...pet.mastery[action.variant],
						fuseClaimed: true,
					},
				},
			};
			newState[petIndex] = newPet;
		} else {
			newState.push({
				id: action.petId,
				mastery: {
					...defaultPetMastery,
					[action.variant]: {
						...defaultPetMastery[action.variant],
						fuseClaimed: true,
					},
				},
			});
		}
		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
