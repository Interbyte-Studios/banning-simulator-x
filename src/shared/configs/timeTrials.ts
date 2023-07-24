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
		baseCost: 5,
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
		maxUpgrades: 100,
		benefitPerUpgrade: 1,
		baseCost: 20,
	},
} satisfies TimeTrialUpgrade;

export type TimeTrialCurrency = Record<WorldName, Currency>;
export const TIME_TRIALS_CURRENCIES = {
	"Ban Land": "gears",
} satisfies TimeTrialCurrency;

export const isTimeTrialDifficulty = t.literal("easy", "medium", "hard");
export type TimeTrialDifficulty = t.static<typeof isTimeTrialDifficulty>;

/**
 * The length of a time trial, in seconds.
 */
export const TIME_TRIAL_LENGTH = 60;

/**
 * The attribute name that is set on the player to indicate the time they have
 * remaining in the time trial.
 */
export const TIME_TRIAL_TIMER_ATTRIBUTE = "timeTrialTimer";

/**
 * The attribute name that is set on the player to indicate the difficulty of their
 * time trial.
 */
export const TIME_TRIAL_DIFFICULTY_ATTRIBUTE = "timeTrialDifficulty";

/**
 * The attribute name that is set on the player to indicate the difficulty of their
 * time trial.
 */
export const TIME_TRIAL_WAVE_ATTRIBUTE = "timeTrialWave";

/**
 * The attribute set on `TIME_TRIAL_TIMER_ATTRIBUTE` when waiting for the
 * player to start the time trial.
 */
export const TIME_TRIAL_WAITING_ATTRIBUTE = "waiting";
