import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { RANKS } from "shared/configs/ranks";
import { remotes } from "shared/remotes";
import { unlockRank } from "shared/rodux/rank";

remotes.Server.Create("unlockRank").Connect(
	withPlayerStore((_, store, rank) => {
		const rankData = RANKS[rank];
		if (rankData === undefined) throw `Expected to find rank data for rank with id ${rank}`;

		// not enough experience to unlock rank
		if (store.getState().experience < rankData.requiredExperience) {
			return;
		}

		// not enough currency to unlock rank
		if (store.getState().currencies[rankData.currency] < rankData.amount) {
			return;
		}

		// already owns rank
		if (store.getState().rank >= rank) {
			return;
		}

		// no skipping ranks lol
		if (rank > store.getState().rank + 1) {
			throw `Cannot unlock rank ${rank} when current rank is ${store.getState().rank}`;
		}

		store.dispatch(unlockRank(rank));
	}),
);
