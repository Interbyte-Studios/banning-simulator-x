import { PET_MASTERY_REQUIREMENTS } from "shared/configs/petMastery";
import { remotes } from "shared/remotes";
import { ClaimPetMasteryFailKind } from "shared/remotes/petMastery/claimMastery";
import { claimMastery } from "shared/rodux/petMastery";
import { getPetData } from "shared/util/getPetData";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("petMastery")
	.Create("claimMastery")
	.SetCallback(
		withPlayerStore((_, store, id, variant, method) => {
			const state = store.getState();

			// check to be sure they've not already claimed it
			const petMastery = state.petMastery.get(id);
			if (petMastery !== undefined) {
				return {
					success: false,
					reason: ClaimPetMasteryFailKind.InternalError,
				};
			}

			// Check to be sure they've discovered the pet.
			const petsIndex = state.index.pets.get(id);
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
						if (petsIndex.maxLevel[variant] < variantMasteryRequirements.maxLevel) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughMaxLevels,
							};
						}
					} else if (method === "hatch") {
						if (petsIndex.hatched[variant] < variantMasteryRequirements.hatch) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughHatches,
							};
						}
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
						if (petsIndex.maxLevel[variant] < variantMasteryRequirements.maxLevel) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughMaxLevels,
							};
						}
					} else if (method === "hatch") {
						if (petsIndex.hatched[variant] < variantMasteryRequirements.hatch) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughHatches,
							};
						}
					} else if (method === "fuse") {
						if (petsIndex.fused[variant] < variantMasteryRequirements.fuse) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughFusions,
							};
						}
					}

					break;
				}
				case "radiant": {
					if (method === "maxLevel") {
						if (petsIndex.maxLevel[variant] < variantMasteryRequirements.maxLevel) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughMaxLevels,
							};
						}
					} else if (method === "hatch") {
						return {
							success: false,
							reason: ClaimPetMasteryFailKind.InvalidMastery,
						};
					} else if (method === "fuse") {
						if (petsIndex.fused[variant] < variantMasteryRequirements.fuse) {
							return {
								success: false,
								reason: ClaimPetMasteryFailKind.NotEnoughFusions,
							};
						}
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
