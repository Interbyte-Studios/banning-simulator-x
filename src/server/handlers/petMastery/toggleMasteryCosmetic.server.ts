import { remotes } from "shared/remotes";
import { toggleMasteryCosmetic } from "shared/rodux/petMastery";

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

			// check to be sure they've claimed mastery of the specified variant
			if (petMasteryIndex[variant].claimed === false) {
				return;
			}

			store.dispatch(toggleMasteryCosmetic(id, variant));
		}),
	);
