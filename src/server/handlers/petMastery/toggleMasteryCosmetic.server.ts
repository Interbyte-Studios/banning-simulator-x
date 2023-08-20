debug.setmemorycategory("toggleMasteryCosmetic");
import { remotes } from "shared/remotes";
import { UnreachableCaseError } from "shared/util/unreachableCaseError";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("petMastery")
	.Get("toggleCosmetic")
	.Connect(
		withPlayerStore((_, store, id, variant) => {
			const state = store.getState();

			// check to be sure the pet's been discovered
			const petMasteryIndex = state.petMastery.find((mastery) => mastery.id === id);
			if (petMasteryIndex === undefined) {
				return;
			}

			switch (variant) {
				case "regular": {
					const masteryData = petMasteryIndex.mastery[variant];

					if (!(masteryData.hatchClaimed && masteryData.maxLevelClaimed)) {
						return;
					}
					break;
				}
				case "void": {
					const masteryData = petMasteryIndex.mastery[variant];

					if (!(masteryData.hatchClaimed && masteryData.maxLevelClaimed && masteryData.fuseClaimed)) {
						return;
					}
					break;
				}
				case "radiant": {
					const masteryData = petMasteryIndex.mastery[variant];

					if (!(masteryData.maxLevelClaimed && masteryData.fuseClaimed)) {
						return;
					}
					break;
				}
				default:
					throw new UnreachableCaseError(variant);
			}
		}),
	);
