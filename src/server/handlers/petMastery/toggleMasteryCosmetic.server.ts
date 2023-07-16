import { remotes } from "shared/remotes";
import { PetMasteryStateVariant, toggleMasteryCosmetic } from "shared/rodux/petMastery";
import { UnreachableCaseError } from "shared/util/unreachableCaseError";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("petMastery")
	.Get("toggleCosmetic")
	.Connect(
		withPlayerStore((_, store, id, variant) => {
			const state = store.getState();

			// check to be sure the pet's been discovered
			const petMasteryIndex = state.petMastery.get(id);
			if (petMasteryIndex === undefined) {
				return;
			}

			// check to be sure they've claimed mastery on all challenges for the pets variant.
			const _masteryData = petMasteryIndex[variant];

			switch (variant) {
				case "regular": {
					const masteryData = _masteryData as PetMasteryStateVariant[typeof variant];

					if (!(masteryData.hatchClaimed && masteryData.maxLevelClaimed)) {
						return;
					}
					break;
				}
				case "void": {
					const masteryData = _masteryData as PetMasteryStateVariant[typeof variant];

					if (!(masteryData.hatchClaimed && masteryData.maxLevelClaimed && masteryData.fuseClaimed)) {
						return;
					}
					break;
				}
				case "radiant": {
					const masteryData = _masteryData as PetMasteryStateVariant[typeof variant];

					if (!(masteryData.maxLevelClaimed && masteryData.fuseClaimed)) {
						return;
					}
					break;
				}
				default:
					throw new UnreachableCaseError(variant);
			}

			store.dispatch(toggleMasteryCosmetic(id, variant));
		}),
	);
