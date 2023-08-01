debug.setmemorycategory("upgradeTimeTrials");
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { TIME_TRIAL_UPGRADES, TIME_TRIALS_CURRENCIES } from "shared/configs/timeTrials";
import { remotes } from "shared/remotes";
import { awardCurrency } from "shared/rodux/currencies";
import { claimTimeTrialUpgrade } from "shared/rodux/timeTrials";
import { getTimeTrialsUpgradeCost } from "shared/util/getTimeTrialsUpgradeCost";

remotes.Server.GetNamespace("timeTrials")
	.Get("upgradeTimeTrials")
	.Connect(
		withPlayerStore((_, store, worldName, upgradeName) => {
			const currentState = store.getState();

			// check that they've not already maxed out the upgrades
			const storedUpgradeAmount = currentState.timeTrials[worldName][upgradeName];
			if (storedUpgradeAmount >= TIME_TRIAL_UPGRADES[upgradeName].maxUpgrades) {
				return;
			}

			// check that they have enough currency
			const currencyToUse = TIME_TRIALS_CURRENCIES[worldName];
			const upgradeCost = getTimeTrialsUpgradeCost(upgradeName, storedUpgradeAmount + 1);

			if (currentState.currencies[currencyToUse] < upgradeCost) {
				return;
			}

			// remove currency from store
			store.dispatch(awardCurrency(currencyToUse, -upgradeCost));

			// update store with new upgrade amount
			store.dispatch(claimTimeTrialUpgrade(worldName, upgradeName));
		}),
	);
