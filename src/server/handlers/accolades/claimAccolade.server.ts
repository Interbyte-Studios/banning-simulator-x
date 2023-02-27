import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { remotes } from "shared/remotes";
import { ClaimAccoladeFailKind } from "shared/remotes/accolades/claimAccolade";
import { claimAccolade } from "shared/rodux/accolade";
import { storeBoost, validBoostTime } from "shared/rodux/boosts";
import { awardCurrency } from "shared/rodux/currencies";
import { getAccolade } from "shared/util/getAccolade";

const claimAccoladeRemote = remotes.Server.GetNamespace("accolades").Create("claimAccolade");
claimAccoladeRemote.SetCallback(
	withPlayerStore((_, store, accoladeId) => {
		// check if they've already claimed
		const storedAccolade = store.getState().accolades.find((id) => id === accoladeId);
		if (storedAccolade !== undefined) {
			return {
				success: false,
				reason: ClaimAccoladeFailKind.AlreadyRedeemed,
			};
		}

		// check if they have progressed enough to claim it
		const accolade = getAccolade(accoladeId);
		const canClaim = accolade.progress(store.getState());
		if (!canClaim) {
			return {
				success: false,
				reason: ClaimAccoladeFailKind.NotEnoughProgress,
			};
		}

		// award accolade benefits
		switch (accolade.reward.rewardType) {
			case "gems":
			case "coins": {
				store.dispatch(awardCurrency(accolade.reward.rewardType, accolade.reward.amount));
				break;
			}
			case "x2 Currency":
			case "x2 Hatching Luck":
			case "x2 Pet Experience":
			case "x2 Rank Experience": {
				assert(
					validBoostTime(accolade.reward.amount),
					`The boost time reward was invalid while claiming accolade of id: ${accoladeId}`,
				);

				store.dispatch(storeBoost(accolade.reward.rewardType, accolade.reward.amount));
				break;
			}
		}

		store.dispatch(claimAccolade(accolade.id));

		return {
			success: true,
		};
	}),
);
