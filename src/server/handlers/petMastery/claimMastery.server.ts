debug.setmemorycategory("claimMastery");
import { isEventEgg, isExclusiveEgg } from "shared/configs/eggs";
import { PET_MASTERY_REQUIREMENTS, PET_MASTERY_REWARDS } from "shared/configs/petMastery";
import { remotes } from "shared/remotes";
import { ClaimPetMasteryFailKind } from "shared/remotes/petMastery/claimMastery";
import { storeBoost } from "shared/rodux/boosts";
import { claimFuseMastery, claimHatchMastery, claimMaxLevelMastery } from "shared/rodux/petMastery";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";
import { getPetData } from "shared/util/getPetData";
import { UnreachableCaseError } from "shared/util/unreachableCaseError";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("petMastery")
	.Get("claimMastery")
	.SetCallback(
		withPlayerStore((_, store, id, variant, method) => {
			const state = store.getState();

			// check to be sure they've not already claimed it
			const petMastery = state.petMastery.get(id);

			// Check to be sure they've discovered the pet.
			const petsIndex = state.index.pets.get(id);
			if (petsIndex === undefined) {
				return {
					success: false,
					reason: ClaimPetMasteryFailKind.UndiscoveredPet,
				};
			}

			const eggName = getEggNameFromPetId(id);
			const petData = getPetData(id);
			const variantMasteryRequirements = PET_MASTERY_REQUIREMENTS[petData.rarity][variant];

			// check requirements
			switch (variant) {
				case "regular": {
					if (method === "maxLevel") {
						if (petMastery !== undefined && petMastery[variant].maxLevelClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.maxLevel[variant].cachedMaxLevel.size() < variantMasteryRequirements.maxLevel) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughMaxLevels,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant][method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					} else if (method === "hatch") {
						if (petMastery !== undefined && petMastery[variant].hatchClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.hatched[variant] < variantMasteryRequirements.hatch) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughHatches,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant][method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					} else if (method === "fuse") {
						return {
							success: false,
							reason: ClaimPetMasteryFailKind.InvalidMastery,
						};
					}

					break;
				}
				case "void": {
					if (method === "maxLevel") {
						if (petMastery !== undefined && petMastery.void.maxLevelClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.maxLevel.void.cachedMaxLevel.size() < variantMasteryRequirements.maxLevel) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughMaxLevels,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity].void[method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					} else if (method === "hatch") {
						if (petMastery !== undefined && petMastery.void.hatchClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (isEventEgg(eggName) || isExclusiveEgg(eggName)) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InvalidMastery,
							};
						}

						if (petsIndex.hatched[variant] < variantMasteryRequirements.hatch) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughHatches,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity].void[method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					} else if (method === "fuse") {
						if (petMastery !== undefined && petMastery.void.fuseClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.fused.void < variantMasteryRequirements.fuse) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughFusions,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity].void[method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					}

					break;
				}
				case "radiant": {
					if (method === "maxLevel") {
						if (petMastery !== undefined && petMastery.radiant.maxLevelClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.maxLevel.radiant.cachedMaxLevel.size() < variantMasteryRequirements.maxLevel) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughMaxLevels,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity].radiant[method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					} else if (method === "hatch") {
						return {
							success: false,
							reason: ClaimPetMasteryFailKind.InvalidMastery,
						};
					} else if (method === "fuse") {
						if (petMastery !== undefined && petMastery.radiant.fuseClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.fused.radiant < variantMasteryRequirements.fuse) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughFusions,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity].radiant[method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					}

					break;
				}
			}

			switch (method) {
				case "hatch": {
					if (variant === "radiant") {
						return {
							success: false,
							reason: ClaimPetMasteryFailKind.InternalError,
						};
					}

					store.dispatch(claimHatchMastery(id, variant));
					break;
				}
				case "maxLevel": {
					store.dispatch(claimMaxLevelMastery(id, variant));
					break;
				}
				case "fuse": {
					if (variant === "regular") {
						return {
							success: false,
							reason: ClaimPetMasteryFailKind.InternalError,
						};
					}

					store.dispatch(claimFuseMastery(id, variant));
					break;
				}
				default:
					throw new UnreachableCaseError(method);
			}

			return {
				success: true,
			};
		}),
	);
