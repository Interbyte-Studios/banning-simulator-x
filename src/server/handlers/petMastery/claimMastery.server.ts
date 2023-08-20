debug.setmemorycategory("claimMastery");
import { isEventEgg, isExclusiveEgg } from "shared/configs/eggs";
import { PET_MASTERY_REQUIREMENTS, PET_MASTERY_REWARDS } from "shared/configs/petMastery";
import { PetVariants } from "shared/configs/pets";
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
		withPlayerStore((_, store, pet) => {
			const state = store.getState();

			// check to be sure they've not already claimed it
			if (pet !== undefined) {
				const { id, variant, method } = pet;

				const petMastery = state.petMastery.find((mastery) => mastery.id === id);

				// Check to be sure they've discovered the pet.
				const petsIndex = state.index.pets.find((index) => index.id === id);
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
							if (petMastery !== undefined && petMastery.mastery[variant].maxLevelClaimed) {
								return {
									success: false,
									reason: ClaimPetMasteryFailKind.InternalError,
								};
							}

							if (petsIndex.index.maxLevel[variant] < variantMasteryRequirements.maxLevel) {
								return {
									success: false,
									reason: ClaimPetMasteryFailKind.NotEnoughMaxLevels,
								};
							}

							const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant][method];
							store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
						} else if (method === "hatch") {
							if (petMastery !== undefined && petMastery.mastery[variant].hatchClaimed) {
								return {
									success: false,
									reason: ClaimPetMasteryFailKind.InternalError,
								};
							}

							if (petsIndex.index.hatched[variant] < variantMasteryRequirements.hatch) {
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
							if (petMastery !== undefined && petMastery.mastery.void.maxLevelClaimed) {
								return {
									success: false,
									reason: ClaimPetMasteryFailKind.InternalError,
								};
							}

							if (petsIndex.index.maxLevel.void < variantMasteryRequirements.maxLevel) {
								return {
									success: false,
									reason: ClaimPetMasteryFailKind.NotEnoughMaxLevels,
								};
							}

							const boostReward = PET_MASTERY_REWARDS[petData.rarity].void[method];
							store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
						} else if (method === "hatch") {
							if (petMastery !== undefined && petMastery.mastery.void.hatchClaimed) {
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

							if (petsIndex.index.hatched[variant] < variantMasteryRequirements.hatch) {
								return {
									success: false,
									reason: ClaimPetMasteryFailKind.NotEnoughHatches,
								};
							}

							const boostReward = PET_MASTERY_REWARDS[petData.rarity].void[method];
							store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
						} else if (method === "fuse") {
							if (petMastery !== undefined && petMastery.mastery.void.fuseClaimed) {
								return {
									success: false,
									reason: ClaimPetMasteryFailKind.InternalError,
								};
							}

							if (petsIndex.index.fused.void < variantMasteryRequirements.fuse) {
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
							if (petMastery !== undefined && petMastery.mastery.radiant.maxLevelClaimed) {
								return {
									success: false,
									reason: ClaimPetMasteryFailKind.InternalError,
								};
							}

							if (petsIndex.index.maxLevel.radiant < variantMasteryRequirements.maxLevel) {
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
							if (petMastery !== undefined && petMastery.mastery.radiant.fuseClaimed) {
								return {
									success: false,
									reason: ClaimPetMasteryFailKind.InternalError,
								};
							}

							if (petsIndex.index.fused.radiant < variantMasteryRequirements.fuse) {
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
			} else {
				for (const petIndex of store.getState().index.pets) {
					const mastery = store.getState().petMastery.find((mastery) => mastery.id === petIndex.id);
					const petData = getPetData(petIndex.id);

					for (const variant of PetVariants) {
						const variantMasteryRequirements = PET_MASTERY_REQUIREMENTS[petData.rarity][variant];

						switch (variant) {
							case "regular": {
								if (petIndex.index.maxLevel[variant] > variantMasteryRequirements.maxLevel) {
									if (mastery === undefined || !mastery.mastery[variant].maxLevelClaimed) {
										const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant].maxLevel;
										store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
										store.dispatch(claimMaxLevelMastery(petIndex.id, variant));
									}
								}

								if (petIndex.index.hatched[variant] > variantMasteryRequirements.hatch) {
									if (mastery === undefined || !mastery.mastery[variant].hatchClaimed) {
										const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant].hatch;
										store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
										store.dispatch(claimHatchMastery(petIndex.id, variant));
									}
								}
								break;
							}
							case "void": {
								if (petIndex.index.maxLevel[variant] > variantMasteryRequirements.maxLevel) {
									if (mastery === undefined || !mastery.mastery[variant].maxLevelClaimed) {
										const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant].maxLevel;
										store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
										store.dispatch(claimMaxLevelMastery(petIndex.id, variant));
									}
								}

								if (petIndex.index.hatched[variant] > variantMasteryRequirements.hatch) {
									if (mastery === undefined || !mastery.mastery[variant].hatchClaimed) {
										const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant].hatch;
										store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
										store.dispatch(claimHatchMastery(petIndex.id, variant));
									}
								}

								if (petIndex.index.fused[variant] > variantMasteryRequirements.fuse) {
									if (mastery === undefined || !mastery.mastery[variant].fuseClaimed) {
										const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant].fuse;
										store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
										store.dispatch(claimFuseMastery(petIndex.id, variant));
									}
								}

								break;
							}
							case "radiant": {
								if (petIndex.index.maxLevel[variant] > variantMasteryRequirements.maxLevel) {
									if (mastery === undefined || !mastery.mastery[variant].maxLevelClaimed) {
										const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant].maxLevel;
										store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
										store.dispatch(claimMaxLevelMastery(petIndex.id, variant));
									}
								}

								if (petIndex.index.fused[variant] > variantMasteryRequirements.fuse) {
									if (mastery === undefined || !mastery.mastery[variant].fuseClaimed) {
										const boostReward = PET_MASTERY_REWARDS[petData.rarity][variant].fuse;
										store.dispatch(storeBoost(boostReward.boost, boostReward.duration));
										store.dispatch(claimFuseMastery(petIndex.id, variant));
									}
								}

								break;
							}
						}
					}
				}
			}

			return {
				success: true,
			};
		}),
	);
