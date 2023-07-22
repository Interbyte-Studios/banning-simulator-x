import { t } from "@rbxts/t";

import { Currency } from "./currencies";
import { WorldName } from "./worlds";

export const isTimeTrialUpgrade = t.literal("health", "damage", "damageReduction", "criticalChance");
export type TimeTrialUpgradeType = t.static<typeof isTimeTrialUpgrade>;

export type TimeTrialUpgrade = Record<
	TimeTrialUpgradeType,
	{ maxUpgrades: number; benefitPerUpgrade: number; baseCost: number }
>;

export const TIME_TRIALS_UPGRADE_COST_MULTIPLIER = 1.15;
export const TIME_TRIAL_UPGRADES = {
	health: {
		maxUpgrades: 100,
		benefitPerUpgrade: 50,
		baseCost: 10,
	},
	damage: {
		maxUpgrades: 50,
		benefitPerUpgrade: 0.5,
		baseCost: 25,
	},
	damageReduction: {
		maxUpgrades: 50,
		benefitPerUpgrade: 0.5,
		baseCost: 25,
	},
	criticalChance: {
		maxUpgrades: 50,
		benefitPerUpgrade: 1,
		baseCost: 20,
	},
} satisfies TimeTrialUpgrade;

export type TimeTrialCurrency = Record<WorldName, Currency>;
export const TIME_TRIALS_CURRENCIES = {
	"Ban Land": "gears",
} satisfies TimeTrialCurrency;
