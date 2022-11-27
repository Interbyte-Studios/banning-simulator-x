import { remotes } from "shared/remotes";
import {
	radiantVariantMasteryData,
	regularVariantMasteryData,
	toggleMasteryCosmetic,
	voidVariantMasteryData,
} from "shared/rodux/petMastery";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("petMastery")
	.Create("toggleCosmetic")
	.Connect(
		withPlayerStore((_, store, id, variant) => {
			const state = store.getState();

			// check to be sure the pet's been discovered
			const petMasteryIndex = state.petMastery.get(id);
			if (petMasteryIndex === undefined) {
				return;
			}

			// check to be sure they've claimed mastery on all challenges for the pets variant.
			const masteryData = petMasteryIndex[variant];

			switch (variant) {
				case "regular": {
					assert(regularVariantMasteryData(masteryData), `Mastery data didn't meet strict interface expectations.`);

					if (!(masteryData.hatchClaimed && masteryData.maxLevelClaimed)) {
						return;
					}
					break;
				}
				case "void": {
					assert(voidVariantMasteryData(masteryData), `Mastery data didn't meet strict interface expectations.`);

					if (!(masteryData.hatchClaimed && masteryData.maxLevelClaimed && masteryData.fuseClaimed)) {
						return;
					}
					break;
				}
				case "radiant": {
					assert(radiantVariantMasteryData(masteryData), `Mastery data didn't meet strict interface expectations.`);

					if (!(masteryData.maxLevelClaimed && masteryData.fuseClaimed)) {
						return;
					}
				}
			}

			store.dispatch(toggleMasteryCosmetic(id, variant));
		}),
	);
