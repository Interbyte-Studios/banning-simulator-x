import { t } from "@rbxts/t";

import { Currency } from "./currencies";
import { EggName } from "./eggs";
import { WorldName } from "./worlds";

export const isTimeTrialUpgrade = t.literal("health", "damage", "damageReduction", "criticalChance");
export type TimeTrialUpgradeType = t.static<typeof isTimeTrialUpgrade>;

export type TimeTrialUpgrade = Record<
	TimeTrialUpgradeType,
	{ maxUpgrades: number; benefitPerUpgrade: number; baseCost: number; costMultiplier: number }
>;

export const TIME_TRIAL_EGG: EggName = "Geometric";

export const TIME_TRIAL_UPGRADES = {
	health: {
		maxUpgrades: 500,
		benefitPerUpgrade: 50,
		baseCost: 5,
		costMultiplier: 1.07,
	},
	damage: {
		maxUpgrades: 200,
		benefitPerUpgrade: 0.5,
		baseCost: 25,
		costMultiplier: 1.17,
	},
	damageReduction: {
		maxUpgrades: 75,
		benefitPerUpgrade: 0.5,
		baseCost: 25,
		costMultiplier: 1.2,
	},
	criticalChance: {
		maxUpgrades: 100,
		benefitPerUpgrade: 1,
		baseCost: 20,
		costMultiplier: 1.15,
	},
} satisfies TimeTrialUpgrade;

export type TimeTrialCurrency = Record<WorldName, Currency>;
export const TIME_TRIALS_CURRENCIES = {
	"Ban Land": "gears",
	"Cyber Cities": "cyber tokens",
} satisfies TimeTrialCurrency;

export const isTimeTrialDifficulty = t.literal("easy", "medium", "hard");
export type TimeTrialDifficulty = t.static<typeof isTimeTrialDifficulty>;

/**
 * The length of a time trial, in seconds.
 */
export const TIME_TRIAL_LENGTH = 10 * 60;

/**
 * The number of NPCs spawned first.
 */
export const TIME_TRIAL_BASE_NPCS = 5;

/**
 * The number of additional NPCs spawned per wave.
 */
export const TIME_TRIAL_NPCS_PER_WAVE = 1;

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
 * The attribute name that is set on the player to indicate the number of NPCs.
 */
export const TIME_TRIAL_NPCS_REMAINING = "timeTrialNPCsRemaining";

/**
 * The attribute set on `TIME_TRIAL_TIMER_ATTRIBUTE` when waiting for the
 * player to start the time trial.
 */
export const TIME_TRIAL_WAITING_ATTRIBUTE = "waiting";
