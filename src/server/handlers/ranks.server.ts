import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { RANKS } from "shared/configs/ranks";
import { remotes } from "shared/remotes";
import { unlockRank } from "shared/rodux/rank";

remotes.Server.Create("unlockRank").Connect(
	withPlayerStore((_, store) => {
		const currentRank = store.getState().rank;
		const nextRank = currentRank + 1;

		const rankData = RANKS.find((rank) => rank.id === nextRank);
		if (rankData === undefined) throw `Expected to find rank data for rank with id ${nextRank}`;

		// not enough experience to unlock rank
		if (store.getState().experience < rankData.requiredExperience) {
			return;
		}

		// not enough currency to unlock rank
		if (store.getState().currencies[rankData.cost.currency] < rankData.cost.amount) {
			return;
		}

		store.dispatch(unlockRank(nextRank, rankData.cost.currency, rankData.cost.amount));
	}),
);
