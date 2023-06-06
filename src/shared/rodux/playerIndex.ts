import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { EggName } from "shared/configs/eggs";
import { BoostProduct } from "shared/configs/game";
import { PET_MASTERY_REQUIREMENTS } from "shared/configs/petMastery";
import { PET_MAX_LEVELS } from "shared/configs/pets";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getPetData } from "shared/util/getPetData";
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
				regular: {
					amount: number;
					masteryCache: Array<string>;
				};
				void: {
					amount: number;
					masteryCache: Array<string>;
				};
				radiant: {
					amount: number;
					masteryCache: Array<string>;
				};
			};
		}
	>;
	eggs: Map<EggName, { regular: number; void: number }>;
	timePlayed: number;
	gameVersion: Array<string>;
	groupRank: number | undefined;
	groupRewardClaimed: {
		lastClaimed: number;
		petIdClaimed: number;
	};
	clubRewardClaimed: {
		lastClaimed: number;
		petIdClaimed: number;
	};
	vipRewardClaimed: {
		lastClaimed: number;
		petIdClaimed: number;
	};
}
export type PlayerIndexActions =
	| SetGroupRank
	| AddTimePlayed
	| LogGameVersion
	| ClaimGroupReward
	| ClaimClubReward
	| ClaimVIPReward
	| Admin_ModifyPetLevel;

interface SetGroupRank extends Rodux.Action<"setGroupRank"> {
	rank: number;
}

interface AddTimePlayed extends Rodux.Action<"addTimePlayed"> {}

interface LogGameVersion extends Rodux.Action<"logGameVersion"> {
	version: string;
}
export interface ClaimGroupReward extends Rodux.Action<"claimGroupReward"> {
	claimTime: number;
	boostName: BoostProduct;
	petId?: number;
}
export interface ClaimClubReward extends Rodux.Action<"claimClubReward"> {
	claimTime: number;
	boostName: BoostProduct;
	petId?: number;
}
export interface ClaimVIPReward extends Rodux.Action<"claimVIPReward"> {
	claimTime: number;
	boostName: BoostProduct;
	petId?: number;
}

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

/**
 * @param version The version to log.
 * @returns The Rodux action to dispatch.
 */
export function logGameVersion(version: string): LogGameVersion & Rodux.AnyAction {
	return {
		type: "logGameVersion",
		version,
	};
}

/**
 * @param claimTime The time it was claimed.
 * @param boostName The name of the boost that was claimed.
 * @param petId The pet id that was claimed.
 * @returns The Rodux action to dispatch.
 */
export function claimGroupReward(
	claimTime: number,
	boostName: BoostProduct,
	petId?: number,
): ClaimGroupReward & Rodux.AnyAction {
	return {
		type: "claimGroupReward",
		claimTime,
		petId,
		boostName,
	};
}

/**
 * @param claimTime The time it was claimed.
 * @param boostName The name of the boost that was claimed.
 * @param petId The pet id that was claimed.
 * @returns The Rodux action to dispatch.
 */
export function claimClubReward(
	claimTime: number,
	boostName: BoostProduct,
	petId?: number,
): ClaimClubReward & Rodux.AnyAction {
	return {
		type: "claimClubReward",
		claimTime,
		petId,
		boostName,
	};
}

/**
 * @param claimTime The time it was claimed.
 * @param boostName The name of the boost that was claimed.
 * @param petId The pet id that was claimed.
 * @returns The Rodux action to dispatch.
 */
export function claimVIPReward(
	claimTime: number,
	boostName: BoostProduct,
	petId?: number,
): ClaimVIPReward & Rodux.AnyAction {
	return {
		type: "claimVIPReward",
		claimTime,
		petId,
		boostName,
	};
}

export const defaultPlayerIndex: PlayerIndexState = {
	pets: new Map(),
	eggs: new Map(),
	timePlayed: 0,
	gameVersion: [],
	groupRank: undefined,
	groupRewardClaimed: {
		lastClaimed: 0,
		petIdClaimed: 0,
	},
	clubRewardClaimed: {
		lastClaimed: 0,
		petIdClaimed: 0,
	},
	vipRewardClaimed: {
		lastClaimed: 0,
		petIdClaimed: 0,
	},
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
					warn(`[ Index Reducer | AddPet ] - Failed to get string id for pet with id ${petToIndex.id}`);
					continue;
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
							regular: {
								amount: 0,
								masteryCache: [],
							},
							void: {
								amount: 0,
								masteryCache: [],
							},
							radiant: {
								amount: 0,
								masteryCache: [],
							},
						},
					});

					pet = newState.pets.get(stringId);
					if (pet === undefined) {
						warn(`[ Index Reducer | AddPet ] - Failed to set index data for pet with id "${stringId}".`);
						continue;
					}
				}

				const eggFromPetId = getEggNameFromPetId(petToIndex.id);
				let egg = newState.eggs.get(eggFromPetId);
				if (egg === undefined) {
					newState.eggs.set(eggFromPetId, { regular: 0, void: 0 });

					egg = newState.eggs.get(eggFromPetId);
					if (egg === undefined) {
						warn(`[ Index Reducer | AddPet ] - Failed to set index data for egg "${eggFromPetId}".`);
						continue;
					}
				}
				if (petToIndex.variant === "regular") {
					newState.eggs.set(eggFromPetId, { ...egg, regular: egg.regular + 1 });
				} else if (petToIndex.variant === "void") {
					newState.eggs.set(eggFromPetId, { ...egg, void: egg.void + 1 });
				}

				switch (petToIndex.method) {
					case "admin":
					case "trade":
					case "hatch": {
						if (!isValidIndexHatch(petToIndex.variant)) {
							continue;
						}

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
						if (!isValidIndexFusion(petToIndex.variant)) {
							warn(
								`[ Index Reducer | AddPet ] - Attempted to index a pet fusion of unsupported variant "${petToIndex.variant}".`,
							);
							continue;
						}

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
						warn(`[ Index Reducer | AddPet ] - Attempting to add pet with method "maxLevel"? This is unallowed.`);
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
		logGameVersion: (state, action) => {
			return { ...state, gameVersion: [...state.gameVersion, action.version] };
		},
		claimGroupReward: (state, action) => {
			return {
				...state,
				groupRewardClaimed: {
					...state.groupRewardClaimed,
					lastClaimed: action.claimTime,
					petIdClaimed: action.petId !== undefined ? action.petId : state.groupRewardClaimed.petIdClaimed,
				},
			};
		},
		claimClubReward: (state, action) => {
			return {
				...state,
				clubRewardClaimed: {
					...state.clubRewardClaimed,
					lastClaimed: action.claimTime,
					petIdClaimed: action.petId !== undefined ? action.petId : state.clubRewardClaimed.petIdClaimed,
				},
			};
		},
		claimVIPReward: (state, action) => {
			return {
				...state,
				vipRewardClaimed: {
					...state.vipRewardClaimed,
					lastClaimed: action.claimTime,
					petIdClaimed: action.petId !== undefined ? action.petId : state.vipRewardClaimed.petIdClaimed,
				},
			};
		},
		killNpc: (state, action) => {
			const newState = { ...state };

			for (const pet of action.equippedPets) {
				const stringId = tostring(pet.id);
				if (stringId === undefined) {
					warn(`[ Index Reducer | KillNPC ] - Failed to get string id for pet with id ${pet.id}`);
					continue;
				}

				let masteryData = newState.pets.get(stringId);
				if (masteryData === undefined) {
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
							regular: {
								amount: 0,
								masteryCache: [],
							},
							void: {
								amount: 0,
								masteryCache: [],
							},
							radiant: {
								amount: 0,
								masteryCache: [],
							},
						},
					});

					masteryData = newState.pets.get(stringId);
					if (masteryData === undefined) {
						warn(`[ Index Reducer | KillNPC ] - Failed to set index data for pet with id "${stringId}".`);
						continue;
					}
				}

				const maxLevel = PET_MAX_LEVELS[pet.variant];
				const petLevel = getPetLevel(pet);
				const petData = getPetData(pet.id);

				if (petLevel < maxLevel) {
					continue;
				}

				let wasNewPet = false;
				const newUniqueCache = [...masteryData.maxLevel[pet.variant].masteryCache];
				if (!newUniqueCache.includes(pet.guid)) {
					wasNewPet = true;

					if (newUniqueCache.size() < PET_MASTERY_REQUIREMENTS[petData.rarity][pet.variant].maxLevel) {
						newUniqueCache.push(pet.guid);
					}
				}

				newState.pets.set(stringId, {
					hatched: masteryData.hatched,
					fused: masteryData.fused,
					maxLevel: {
						...masteryData.maxLevel,
						[pet.variant]: {
							amount: wasNewPet
								? masteryData.maxLevel[pet.variant].amount + 1
								: masteryData.maxLevel[pet.variant].amount,
							masteryCache: newUniqueCache,
						},
					},
				});
			}

			return newState;
		},
		admin_ModifyPetLevel: (state, action) => {
			const newState = { ...state };

			const stringId = tostring(action.id);
			if (stringId === undefined) {
				warn(`[ Index Reducer | Admin Modify Pet Level ] - Failed to get string id for pet with id ${action.id}`);
				return newState;
			}

			const petIndex = newState.pets.get(stringId);
			if (petIndex === undefined) {
				warn(`[ Index Reducer | Admin Modify Pet Level ] - Failed to get pet index for pet with id ${stringId}`);
				return newState;
			}

			const maxLevel = PET_MAX_LEVELS[action.variant];
			if (action.level >= maxLevel) {
				const petData = getPetData(action.id);

				let wasNewPet = false;
				const newUniqueCache = [...petIndex.maxLevel[action.variant].masteryCache];
				if (!newUniqueCache.includes(action.guid)) {
					wasNewPet = true;

					if (newUniqueCache.size() < PET_MASTERY_REQUIREMENTS[petData.rarity][action.variant].maxLevel) {
						newUniqueCache.push(action.guid);
					}
				}

				newState.pets.set(stringId, {
					hatched: petIndex.hatched,
					fused: petIndex.fused,
					maxLevel: {
						...petIndex.maxLevel,
						[action.variant]: {
							amount: wasNewPet
								? petIndex.maxLevel[action.variant].amount + 1
								: petIndex.maxLevel[action.variant].amount,
							masteryCache: newUniqueCache,
						},
					},
				});
			}

			return newState;
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
