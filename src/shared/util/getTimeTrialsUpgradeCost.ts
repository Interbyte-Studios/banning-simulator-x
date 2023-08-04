import { TIME_TRIAL_UPGRADES, TimeTrialUpgradeType } from "shared/configs/timeTrials";

/**
 * Returns the cost of the next upgrade for the time trials.
 *
 * @param upgradeName The name of the upgrade.
 * @param upgradeAmount The amount of upgrades already purchased.
 * @returns The cost of the next upgrade.
 */
export function getTimeTrialsUpgradeCost(upgradeName: TimeTrialUpgradeType, upgradeAmount: number): number {
	const baseCost = TIME_TRIAL_UPGRADES[upgradeName].baseCost;
	const costMultiplier = TIME_TRIAL_UPGRADES[upgradeName].costMultiplier;

	const upgradeCost = baseCost * costMultiplier ** upgradeAmount;
	return upgradeCost;
}
