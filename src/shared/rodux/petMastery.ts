import Rodux from "@rbxts/rodux";
import { Variants } from "shared/configs/pets";

export type PetMasteryState = Map<
	number,
	{
		regular: {
			hatchClaimed: boolean;
			maxLevelClaimed: boolean;
			cosmeticEnabled: boolean;
		};
		void: {
			hatchClaimed: boolean;
			maxLevelClaimed: boolean;
			fuseClaimed: boolean;
			cosmeticEnabled: boolean;
		};
		radiant: {
			maxLevelClaimed: boolean;
			fuseClaimed: boolean;
			cosmeticEnabled: boolean;
		};
	}
>;
export type PetMasteryStateVariant = PetMasteryState extends Map<unknown, infer T> ? T : never;

export type PetMasteryActions = ClaimHatchMastery | ClaimMaxLevelMastery | ClaimFuseMastery | ToggleMasteryCosmetic;

export const defaultPetMasteryState: PetMasteryState extends Map<unknown, infer T> ? T : never = {
	regular: { hatchClaimed: false, maxLevelClaimed: false, cosmeticEnabled: false },
	void: { hatchClaimed: false, maxLevelClaimed: false, fuseClaimed: false, cosmeticEnabled: false },
	radiant: { maxLevelClaimed: false, fuseClaimed: false, cosmeticEnabled: false },
};

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
export const petMasteryReducer = Rodux.createReducer<PetMasteryState, PetMasteryActions>(new Map(), {
	claimHatchMastery: (state, action) => {
		const newState = new Map([...state]);

		let petMasteryData = newState.get(action.petId) ?? defaultPetMasteryState;

		petMasteryData = {
			...petMasteryData,
			[action.variant]: {
				...petMasteryData[action.variant],
			},
		};

		const masteryData = petMasteryData[action.variant];
		masteryData.hatchClaimed = true;

		// we enable the cosmetic by default if we were hatching a regular and we have achieved the max level
		if (!masteryData.cosmeticEnabled && action.variant === "regular" && masteryData.maxLevelClaimed) {
			masteryData.cosmeticEnabled = true;
		}

		newState.set(action.petId, petMasteryData);
		return newState;
	},
	claimMaxLevelMastery: (state, action) => {
		const newState = new Map([...state]);

		let petMasteryData = newState.get(action.petId) ?? defaultPetMasteryState;

		petMasteryData = {
			...petMasteryData,
			[action.variant]: {
				...petMasteryData[action.variant],
			},
		};

		const masteryData = petMasteryData[action.variant];
		masteryData.maxLevelClaimed = true;

		// we enable the cosmetic by default if we were hatching a regular and we have achieved the max level
		if (!masteryData.cosmeticEnabled && action.variant === "regular" && masteryData.maxLevelClaimed) {
			masteryData.cosmeticEnabled = true;
		}

		newState.set(action.petId, petMasteryData);
		return newState;
	},
	claimFuseMastery: (state, action) => {
		const newState = new Map([...state]);

		let petMasteryData = newState.get(action.petId) ?? defaultPetMasteryState;

		petMasteryData = {
			...petMasteryData,
			[action.variant]: {
				...petMasteryData[action.variant],
			},
		};

		const masteryData = petMasteryData[action.variant];
		masteryData.fuseClaimed = true;

		newState.set(action.petId, petMasteryData);
		return newState;
	},
	toggleMasteryCosmetic: (state, action) => {
		const newState = new Map([...state]);

		let petMasteryData = newState.get(action.petId) ?? defaultPetMasteryState;

		petMasteryData = {
			...petMasteryData,
			[action.variant]: {
				...petMasteryData[action.variant],
			},
		};

		const masteryData = petMasteryData[action.variant];
		masteryData.cosmeticEnabled = !masteryData.cosmeticEnabled;

		newState.set(action.petId, petMasteryData);
		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
