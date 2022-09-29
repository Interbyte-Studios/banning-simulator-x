import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { RANKS } from "shared/configs/ranks";
import { remotes } from "shared/remotes";
import { unlockRank } from "shared/rodux/rank";

remotes.Server.Create("unlockRank").Connect(
	withPlayerStore((_, store) => {
		const currentRank = store.getState().rank - 1;
		const nextRank = currentRank + 1;

		const rankData = RANKS[nextRank];
		if (rankData === undefined) throw `Expected to find rank data for rank with id ${nextRank}`;

		warn(`Unlocking rank ${rankData.name}`);

		// not enough experience to unlock rank
		if (store.getState().experience < rankData.requiredExperience) {
			return;
		}

		// not enough currency to unlock rank
		if (store.getState().currencies[rankData.currency] < rankData.amount) {
			return;
		}

		store.dispatch(unlockRank(nextRank + 1));
	}),
);
