interface Mastery {
	level: number;
}

export interface FusionMastery extends Mastery {
	requiredFusions: number;
	reducedFusionMultiplier: number;
}

export interface BanningMastery extends Mastery {
	requiredBans: number;
	currencyGainedMultiplier: number;
}

export interface BoostsMastery extends Mastery {
	requiredUses: number;
	extendedDurationMultiplier: number;
}

export interface RankMastery extends Mastery {
	maxLevelPets: number;
	additionalPetExperienceMultiplier: number;
}

export interface EggsMastery extends Mastery {
	requiredHatches: number;
	reducedEggCostMultiplier: number;
}

interface _AccountMastery {
	fusing: Array<FusionMastery>;
	banning: Array<BanningMastery>;
	boosts: Array<BoostsMastery>;
	rank: Array<RankMastery>;
	eggs: Array<EggsMastery>;
}

export type AccountMasteryType = keyof typeof AccountMastery;
export const AccountMastery: _AccountMastery = {
	fusing: [
		{
			level: 1,
			requiredFusions: 0,
			reducedFusionMultiplier: 0,
		},
		{
			level: 2,
			requiredFusions: 20,
			reducedFusionMultiplier: 0.04,
		},
		{
			level: 3,
			requiredFusions: 50,
			reducedFusionMultiplier: 0.08,
		},
		{
			level: 4,
			requiredFusions: 125,
			reducedFusionMultiplier: 0.12,
		},
		{
			level: 5,
			requiredFusions: 320,
			reducedFusionMultiplier: 0.16,
		},
		{
			level: 6,
			requiredFusions: 800,
			reducedFusionMultiplier: 0.2,
		},
		{
			level: 7,
			requiredFusions: 2000,
			reducedFusionMultiplier: 0.24,
		},
		{
			level: 8,
			requiredFusions: 5000,
			reducedFusionMultiplier: 0.28,
		},
		{
			level: 9,
			requiredFusions: 12500,
			reducedFusionMultiplier: 0.32,
		},
		{
			level: 10,
			requiredFusions: 31250,
			reducedFusionMultiplier: 0.4,
		},
	],
	banning: [
		// implemented
		{
			level: 1,
			requiredBans: 0,
			currencyGainedMultiplier: 1,
		},
		{
			level: 2,
			requiredBans: 100,
			currencyGainedMultiplier: 1.05,
		},
		{
			level: 3,
			requiredBans: 750,
			currencyGainedMultiplier: 1.1,
		},
		{
			level: 4,
			requiredBans: 6000,
			currencyGainedMultiplier: 1.15,
		},
		{
			level: 5,
			requiredBans: 45000,
			currencyGainedMultiplier: 1.2,
		},
		{
			level: 6,
			requiredBans: 275000,
			currencyGainedMultiplier: 1.25,
		},
		{
			level: 7,
			requiredBans: 500000,
			currencyGainedMultiplier: 1.3,
		},
		{
			level: 8,
			requiredBans: 850000,
			currencyGainedMultiplier: 1.35,
		},
		{
			level: 9,
			requiredBans: 1200000,
			currencyGainedMultiplier: 1.4,
		},
		{
			level: 10,
			requiredBans: 2000000,
			currencyGainedMultiplier: 1.5,
		},
	],
	boosts: [
		// implemented
		{
			level: 1,
			requiredUses: 5,
			extendedDurationMultiplier: 1,
		},
		{
			level: 2,
			requiredUses: 10,
			extendedDurationMultiplier: 1.06,
		},
		{
			level: 3,
			requiredUses: 25,
			extendedDurationMultiplier: 1.09,
		},
		{
			level: 4,
			requiredUses: 50,
			extendedDurationMultiplier: 1.12,
		},
		{
			level: 5,
			requiredUses: 100,
			extendedDurationMultiplier: 1.15,
		},
		{
			level: 6,
			requiredUses: 200,
			extendedDurationMultiplier: 1.18,
		},
		{
			level: 7,
			requiredUses: 400,
			extendedDurationMultiplier: 1.21,
		},
		{
			level: 8,
			requiredUses: 600,
			extendedDurationMultiplier: 1.24,
		},
		{
			level: 9,
			requiredUses: 800,
			extendedDurationMultiplier: 1.27,
		},
		{
			level: 10,
			requiredUses: 1000,
			extendedDurationMultiplier: 1.3,
		},
	],
	rank: [
		// implemented
		{
			level: 1,
			maxLevelPets: 0,
			additionalPetExperienceMultiplier: 1,
		},
		{
			level: 2,
			maxLevelPets: 50,
			additionalPetExperienceMultiplier: 1.15,
		},
		{
			level: 3,
			maxLevelPets: 100,
			additionalPetExperienceMultiplier: 1.225,
		},
		{
			level: 4,
			maxLevelPets: 250,
			additionalPetExperienceMultiplier: 1.3,
		},
		{
			level: 5,
			maxLevelPets: 500,
			additionalPetExperienceMultiplier: 1.375,
		},
		{
			level: 6,
			maxLevelPets: 750,
			additionalPetExperienceMultiplier: 1.45,
		},
		{
			level: 7,
			maxLevelPets: 1000,
			additionalPetExperienceMultiplier: 1.525,
		},
		{
			level: 8,
			maxLevelPets: 1500,
			additionalPetExperienceMultiplier: 1.6,
		},
		{
			level: 9,
			maxLevelPets: 2000,
			additionalPetExperienceMultiplier: 1.675,
		},
		{
			level: 10,
			maxLevelPets: 2500,
			additionalPetExperienceMultiplier: 1.75,
		},
	],
	eggs: [
		// implemented
		{
			level: 1,
			requiredHatches: 0,
			reducedEggCostMultiplier: 0,
		},
		{
			level: 2,
			requiredHatches: 25000,
			reducedEggCostMultiplier: 0.08,
		},
		{
			level: 3,
			requiredHatches: 50000,
			reducedEggCostMultiplier: 0.12,
		},
		{
			level: 4,
			requiredHatches: 100000,
			reducedEggCostMultiplier: 0.16,
		},
		{
			level: 5,
			requiredHatches: 250000,
			reducedEggCostMultiplier: 0.2,
		},
		{
			level: 6,
			requiredHatches: 500000,
			reducedEggCostMultiplier: 0.24,
		},
		{
			level: 7,
			requiredHatches: 750000,
			reducedEggCostMultiplier: 0.28,
		},
		{
			level: 8,
			requiredHatches: 1000000,
			reducedEggCostMultiplier: 0.32,
		},
		{
			level: 9,
			requiredHatches: 1500000,
			reducedEggCostMultiplier: 0.36,
		},
		{
			level: 10,
			requiredHatches: 2500000,
			reducedEggCostMultiplier: 0.4,
		},
	],
};
