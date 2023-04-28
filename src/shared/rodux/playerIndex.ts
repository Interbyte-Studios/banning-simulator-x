import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { EggName } from "shared/configs/eggs";
import { PET_MAX_LEVELS } from "shared/configs/pets";
import { getPetLevel } from "shared/util/getPetLevel";

import { KillNpc } from "./currencies";
import { AddPet, Admin_ModifyPetLevel } from "./pets";

export const isValidIndexHatch = t.literal("regular", "void");
export const isValidIndexFusion = t.literal("void", "radiant");

export const validHatchedIndex = t.strictInterface({
	regular: t.number,
	void: t.number,
});

export const validFusedIndex = t.strictInterface({
	void: t.number,
	radiant: t.number,
});

export const validMaxLevelIndex = t.strictInterface({
	regular: t.number,
	void: t.number,
	radiant: t.number,
});

export interface PlayerIndexState {
	pets: Map<
		string,
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
				regular: number;
				void: number;
				radiant: number;
			};
		}
	>;
	eggs: Map<EggName, { regular: number; void: number }>;
	timePlayed: number;
	gameVersion: Array<number>;
	groupRank: number | undefined;
}
export type PlayerIndexActions = SetGroupRank | AddTimePlayed | Admin_ModifyPetLevel;

interface SetGroupRank extends Rodux.Action<"setGroupRank"> {
	rank: number;
}

interface AddTimePlayed extends Rodux.Action<"addTimePlayed"> {}

/**
 * @param rank The rank to set.
 * @returns The Rodux action to dispatch.
 */
export function setGroupRank(rank: number): SetGroupRank & Rodux.AnyAction {
	return {
		type: "setGroupRank",
		rank,
	};
}

/**
 * @returns The Rodux action to dispatch.
 */
export function addTimePlayed(): AddTimePlayed & Rodux.AnyAction {
	return {
		type: "addTimePlayed",
	};
}

export const defaultPlayerIndex: PlayerIndexState = {
	pets: new Map(),
	eggs: new Map(),
	timePlayed: 0,
	gameVersion: [0],
	groupRank: undefined,
};

/* eslint-disable jsdoc/require-jsdoc */
export const playerIndexReducer = Rodux.createReducer<PlayerIndexState, AddPet | PlayerIndexActions | KillNpc>(
	defaultPlayerIndex,
	{
		addPet: (state, action) => {
			const newState = { ...state };

			for (const petToIndex of action.pets) {
				const stringId = tostring(petToIndex.id);
				if (stringId === undefined) {
					throw `Failed to get string id for pet with id ${petToIndex.id}`;
				}

				let pet = newState.pets.get(stringId);
				if (pet === undefined) {
					newState.pets.set(stringId, {
						hatched: {
							regular: 0,
							void: 0,
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
					});

					pet = newState.pets.get(stringId);
					assert(pet, `Failed to set index data for pet with id "${stringId}".`);
				}

				let egg = newState.eggs.get(petToIndex.egg);
				if (egg === undefined) {
					newState.eggs.set(petToIndex.egg, { regular: 0, void: 0 });

					egg = newState.eggs.get(petToIndex.egg);
					assert(egg, `Failed to set index data for egg "${petToIndex.egg}".`);
				}
				if (petToIndex.variant === "regular") {
					newState.eggs.set(petToIndex.egg, { ...egg, regular: egg.regular + 1 });
				} else if (petToIndex.variant === "void") {
					newState.eggs.set(petToIndex.egg, { ...egg, void: egg.void + 1 });
				}

				switch (petToIndex.method) {
					case "admin":
					case "hatch": {
						assert(
							isValidIndexHatch(petToIndex.variant),
							`Attempted to index a pet hatch of unsupported variant "${petToIndex.variant}".`,
						);

						newState.pets.set(stringId, {
							fused: pet.fused,
							maxLevel: pet.maxLevel,
							hatched: {
								...pet.hatched,
								[petToIndex.variant]: pet.hatched[petToIndex.variant] + 1,
							},
						});
						break;
					}
					case "fuse": {
						assert(
							isValidIndexFusion(petToIndex.variant),
							`Attempted to index a pet fusion of unsupported variant "${petToIndex.variant}".`,
						);

						newState.pets.set(stringId, {
							fused: {
								...pet.fused,
								[petToIndex.variant]: pet.fused[petToIndex.variant] + 1,
							},
							maxLevel: pet.maxLevel,
							hatched: pet.hatched,
						});
						break;
					}
					case "maxLevel": {
						warn(`Attempting to add pet with method "maxLevel"? This is unallowed.`);
						continue;
					}
				}
			}

			return newState;
		},
		setGroupRank: (state, action) => {
			return { ...state, groupRank: action.rank };
		},
		addTimePlayed: (state) => {
			return { ...state, timePlayed: state.timePlayed + 1 };
		},
		killNpc: (state, action) => {
			const newState = { ...state };

			for (const pet of action.equippedPets) {
				const stringId = tostring(pet.id);
				if (stringId === undefined) {
					throw `Failed to get string id for pet with id ${pet.id}`;
				}

				const masteryData = newState.pets.get(stringId);
				assert(masteryData, `Failed to get mastery data for pet with id ${pet.id}`);

				const maxLevel = PET_MAX_LEVELS[pet.variant];
				const petLevel = getPetLevel(pet);

				if (petLevel < maxLevel) {
					continue;
				}

				newState.pets.set(stringId, {
					hatched: masteryData.hatched,
					fused: masteryData.fused,
					maxLevel: {
						...masteryData.maxLevel,
						[pet.variant]: masteryData.maxLevel[pet.variant] + 1,
					},
				});
			}

			return newState;
		},
		admin_ModifyPetLevel: (state, action) => {
			const newState = { ...state };

			const stringId = tostring(action.id);
			if (stringId === undefined) {
				throw `Failed to get string id for pet with id ${action.id}`;
			}

			const petIndex = newState.pets.get(stringId);
			assert(petIndex, `Admin: Failed to get pet index for pet with id ${stringId}`);

			const maxLevel = PET_MAX_LEVELS[action.variant];
			if (action.level >= maxLevel) {
				newState.pets.set(stringId, {
					hatched: petIndex.hatched,
					fused: petIndex.fused,
					maxLevel: {
						...petIndex.maxLevel,
						[action.variant]: petIndex.maxLevel[action.variant] + 1,
					},
				});
			}

			return newState;
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
