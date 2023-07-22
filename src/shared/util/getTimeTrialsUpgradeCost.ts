import {
	TIME_TRIAL_UPGRADES,
	TIME_TRIALS_UPGRADE_COST_MULTIPLIER,
	TimeTrialUpgradeType,
} from "shared/configs/timeTrials";

/**
 * Returns the cost of the next upgrade for the time trials.
 *
 * @param upgradeName The name of the upgrade.
 * @param upgradeAmount The amount of upgrades already purchased.
 * @returns The cost of the next upgrade.
 */
export function getTimeTrialsUpgradeCost(upgradeName: TimeTrialUpgradeType, upgradeAmount: number): number {
	const baseCost = TIME_TRIAL_UPGRADES[upgradeName].baseCost;

	const upgradeCost = baseCost * (TIME_TRIALS_UPGRADE_COST_MULTIPLIER ^ upgradeAmount);
	return upgradeCost;
}
