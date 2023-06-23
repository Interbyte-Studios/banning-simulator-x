import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { Variants } from "shared/configs/pets";

import { PetAttainMethod } from "./pets";

export const regularVariantMasteryData = t.strictInterface({
	hatchClaimed: t.boolean,
	maxLevelClaimed: t.boolean,
	cosmeticEnabled: t.boolean,
});

export const voidVariantMasteryData = t.strictInterface({
	hatchClaimed: t.boolean,
	maxLevelClaimed: t.boolean,
	fuseClaimed: t.boolean,
	cosmeticEnabled: t.boolean,
});

export const radiantVariantMasteryData = t.strictInterface({
	maxLevelClaimed: t.boolean,
	fuseClaimed: t.boolean,
	cosmeticEnabled: t.boolean,
});

export type PetMasteryState = Map<
	string,
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
export type PetMasteryActions = ClaimMastery | ToggleMasteryCosmetic;

export const defaultPetMasteryState: PetMasteryState = new Map();

interface ClaimMastery extends Rodux.Action<"claimMastery"> {
	petId: number;
	variant: Variants;
	kind: PetAttainMethod;
}

/**
 * @param petId The id of the pet.
 * @param variant The variant of the pet.
 * @param kind The kind of mastery challenge to check.
 * @returns The Rodux action to dispatch.
 */
export function claimMastery(petId: number, variant: Variants, kind: PetAttainMethod): ClaimMastery & Rodux.AnyAction {
	return {
		type: "claimMastery",
		petId,
		variant,
		kind,
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
export const petMasteryReducer = Rodux.createReducer<PetMasteryState, PetMasteryActions>(defaultPetMasteryState, {
	claimMastery: (state, action) => {
		const newState = new Map([...state]);

		const stringId = tostring(action.petId);
		let petMasteryData = newState.get(stringId);
		if (petMasteryData === undefined) {
			newState.set(stringId, {
				regular: { hatchClaimed: false, maxLevelClaimed: false, cosmeticEnabled: false },
				void: { hatchClaimed: false, maxLevelClaimed: false, fuseClaimed: false, cosmeticEnabled: false },
				radiant: { maxLevelClaimed: false, fuseClaimed: false, cosmeticEnabled: false },
			});

			petMasteryData = newState.get(stringId);
			if (petMasteryData === undefined) {
				warn(
					`[ Pet Mastery Reducer ] - Failed to set pet mastery data for pet with id "${action.petId}" of variant "${action.variant}".`,
				);
				return newState;
			}
		}

		petMasteryData = {
			...petMasteryData,
			[action.variant]: {
				...petMasteryData[action.variant],
			},
		};

		const masteryData = petMasteryData[action.variant];
		switch (action.kind) {
			case "fuse": {
				if (!voidVariantMasteryData(masteryData) && !radiantVariantMasteryData(masteryData)) {
					warn(`[ Pet Mastery Reducer ] - Mastery data didn't meet strict interface expectations.`);
					return newState;
				}

				masteryData.fuseClaimed = true;
				break;
			}
			case "hatch": {
				if (!regularVariantMasteryData(masteryData) && !voidVariantMasteryData(masteryData)) {
					warn(`[ Pet Mastery Reducer ] - Mastery data didn't meet strict interface expectations.`);
					return newState;
				}

				masteryData.hatchClaimed = true;
				break;
			}
			case "maxLevel": {
				if (
					!regularVariantMasteryData(masteryData) &&
					!voidVariantMasteryData(masteryData) &&
					!radiantVariantMasteryData(masteryData)
				) {
					warn(`[ Pet Mastery Reducer ] - Mastery data didn't meet strict interface expectations.`);
					return newState;
				}

				masteryData.maxLevelClaimed = true;
				break;
			}
		}

		switch (action.variant) {
			case "regular": {
				if (!regularVariantMasteryData(masteryData)) {
					warn(`[ Pet Mastery Reducer ] - Mastery data didn't meet strict interface expectations.`);
					return newState;
				}

				if (masteryData.hatchClaimed && masteryData.maxLevelClaimed) {
					masteryData.cosmeticEnabled = true;
				}

				if (masteryData.hatchClaimed && masteryData.maxLevelClaimed) {
					masteryData.cosmeticEnabled = true;
				}

				if (masteryData.hatchClaimed && masteryData.maxLevelClaimed) {
					masteryData.cosmeticEnabled = true;
				}
			}
		}

		newState.set(stringId, petMasteryData);
		return newState;
	},
	toggleMasteryCosmetic: (state, action) => {
		const newState = new Map([...state]);

		const stringId = tostring(action.petId);
		let petMasteryData = newState.get(stringId);
		if (petMasteryData === undefined) {
			newState.set(stringId, {
				regular: { hatchClaimed: false, maxLevelClaimed: false, cosmeticEnabled: false },
				void: { hatchClaimed: false, maxLevelClaimed: false, fuseClaimed: false, cosmeticEnabled: false },
				radiant: { maxLevelClaimed: false, fuseClaimed: false, cosmeticEnabled: false },
			});

			petMasteryData = newState.get(stringId);
			if (petMasteryData === undefined) {
				warn(
					`[ Pet Mastery Reducer ] - Failed to set pet mastery data for pet with id "${action.petId}" of variant "${action.variant}".`,
				);
				return newState;
			}
		}

		petMasteryData = {
			...petMasteryData,
			[action.variant]: {
				...petMasteryData[action.variant],
			},
		};

		const masteryData = petMasteryData[action.variant];
		masteryData.cosmeticEnabled = !masteryData.cosmeticEnabled;

		newState.set(stringId, petMasteryData);

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
