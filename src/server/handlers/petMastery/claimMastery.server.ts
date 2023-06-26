import { PET_MASTERY_REQUIREMENTS, PET_MASTERY_REWARDS } from "shared/configs/petMastery";
import { remotes } from "shared/remotes";
import { ClaimPetMasteryFailKind } from "shared/remotes/petMastery/claimMastery";
import { storeBoost } from "shared/rodux/boosts";
import { claimMastery } from "shared/rodux/petMastery";
import { getPetData } from "shared/util/getPetData";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("petMastery")
	.Get("claimMastery")
	.SetCallback(
		withPlayerStore((_, store, id, variant, method) => {
			const state = store.getState();

			// check to be sure they've not already claimed it
			const petMastery = state.petMastery.get(tostring(id));

			const stringId = tostring(id);
			if (stringId === undefined) {
				warn(`Could not get string id`);
				return {
					success: false,
					reason: ClaimPetMasteryFailKind.InternalError,
				};
			}

			// Check to be sure they've discovered the pet.
			const petsIndex = state.index.pets.get(stringId);
			if (petsIndex === undefined) {
				return {
					success: false,
					reason: ClaimPetMasteryFailKind.UndiscoveredPet,
				};
			}

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

						if (petsIndex.maxLevel[variant].masteryCache.size() < variantMasteryRequirements.maxLevel) {
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
						if (petMastery !== undefined && petMastery[variant].maxLevelClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.maxLevel[variant].masteryCache.size() < variantMasteryRequirements.maxLevel) {
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
						if (petMastery !== undefined && petMastery[variant].fuseClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.fused[variant] < variantMasteryRequirements.fuse) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughFusions,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant][method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					}

					break;
				}
				case "radiant": {
					if (method === "maxLevel") {
						if (petMastery !== undefined && petMastery[variant].maxLevelClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.maxLevel[variant].masteryCache.size() < variantMasteryRequirements.maxLevel) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughMaxLevels,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant][method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					} else if (method === "hatch") {
						return {
							success: false,
							reason: ClaimPetMasteryFailKind.InvalidMastery,
						};
					} else if (method === "fuse") {
						if (petMastery !== undefined && petMastery[variant].fuseClaimed) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.InternalError,
							};
						}

						if (petsIndex.fused[variant] < variantMasteryRequirements.fuse) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughFusions,
							};
						}

						const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant][method];
						store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
					}

					break;
				}
			}

			store.dispatch(claimMastery(id, variant, method));

			return {
				success: true,
			};
		}),
	);
