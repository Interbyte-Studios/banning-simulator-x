import { StoreState } from "shared/rodux";
import { ValidBoostTime } from "shared/rodux/boosts";
import { getBanningMastery } from "shared/util/getBanningMastery";
import { getBoostMastery } from "shared/util/getBoostMastery";
import { getEggsMastery } from "shared/util/getEggsMastery";
import { getPetExperienceMastery } from "shared/util/getPetExperienceMastery";

import { Currency } from "./currencies";
import { EGGS } from "./eggs";
import { BoostProduct } from "./game";
import { WEAPONS } from "./weapons";
import { zones } from "./zones";

export type AccoladeCompletion = true | { progressPercentage: number; progress: number; maxProgress: number }; // Able to claim or the percentage of completion
export interface Accolade {
	id: number; // id of the accolade
	name: string; // the display name or title of the accolade
	progress: (state: StoreState) => AccoladeCompletion;
	reward: {
		rewardType: Currency | BoostProduct;
		amount: number | ValidBoostTime;
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const ACCOLADES: Array<Accolade> = [
	{
		id: 1,
		name: "Join Interbyte Studios group",
		progress: (state): AccoladeCompletion => {
			const isInGroup = state.index.groupRank !== undefined;
			if (isInGroup) {
				return true;
			} else {
				return {
					progressPercentage: 0,
					progress: 0,
					maxProgress: 1,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 60,
		},
	},
	{
		id: 2,
		name: "Join the Interbyte Studios server",
		progress: (state): AccoladeCompletion => {
			const verified = state.media.discordVerified;
			if (verified) {
				return true;
			} else {
				return {
					progressPercentage: 0,
					progress: 0,
					maxProgress: 1,
				};
			}
		},
		reward: {
			rewardType: "x2 Rank Experience",
			amount: 60,
		},
	},
	{
		id: 3,
		name: "Complete the account mastery",
		progress: (state): AccoladeCompletion => {
			const totalObjectives = 5; // There are 5 sections of mastery in the game
			let completedObjectives = 0;

			const eggMasteryLevel = getEggsMastery(state.eggs).level;
			const boostMasteryLevel = getBoostMastery(state.boosts).level;
			const petMasteryLevel = getPetExperienceMastery(state.index).level;
			const banMasteryLevel = getBanningMastery(state.bans).level;

			if (eggMasteryLevel >= 10) {
				completedObjectives += 1;
			}

			if (boostMasteryLevel >= 10) {
				completedObjectives += 1;
			}

			if (petMasteryLevel >= 10) {
				completedObjectives += 1;
			}

			if (banMasteryLevel >= 10) {
				completedObjectives += 1;
			}

			if (completedObjectives >= totalObjectives) {
				return true;
			} else {
				return {
					progressPercentage: completedObjectives / totalObjectives,
					progress: completedObjectives,
					maxProgress: totalObjectives,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 120,
		},
	},
	{
		id: 4,
		name: "Complete the Ban Land Pet Mastery",
		progress: (state): AccoladeCompletion => {
			let totalObjectives = 0;
			let completedObjectives = 0;

			for (const [, eggData] of pairs(EGGS)) {
				if (eggData.world !== "Ban Land" || eggData.hidden || !eggData.hatchable) {
					continue;
				}

				for (const petData of eggData.pets) {
					if (petData.rarity === "Secret" || petData.rarity === "Primordial") {
						continue;
					}

					totalObjectives += 7; // total objectives per pet

					const storedMasteryData = state.petMastery.find((mastery) => mastery.id === petData.id);
					if (storedMasteryData === undefined) {
						continue;
					}

					if (storedMasteryData.mastery.radiant.fuseClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.mastery.radiant.maxLevelClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.mastery.void.fuseClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.mastery.void.maxLevelClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.mastery.void.hatchClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.mastery.regular.maxLevelClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.mastery.regular.hatchClaimed) {
						completedObjectives += 1;
					}
				}
			}

			if (completedObjectives >= totalObjectives) {
				return true;
			} else {
				return {
					progressPercentage: completedObjectives / totalObjectives,
					progress: completedObjectives,
					maxProgress: totalObjectives,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 120,
		},
	},
	{
		id: 5,
		name: "Play for 2 hours",
		progress: (state): AccoladeCompletion => {
			const minute = 60; // in seconds
			const hour = minute * 60; // in seconds;
			const twoHours = 2 * hour;

			if (state.index.timePlayed >= twoHours) {
				return true;
			} else {
				return {
					progressPercentage: state.index.timePlayed / twoHours,
					progress: state.index.timePlayed,
					maxProgress: twoHours,
				};
			}
		},
		reward: {
			rewardType: "x2 Currency",
			amount: 15,
		},
	},
	{
		id: 6,
		name: "Play for 10 hours",
		progress: (state): AccoladeCompletion => {
			const minute = 60; // in seconds
			const hour = minute * 60; // in seconds;
			const tenHours = 10 * hour;

			if (state.index.timePlayed >= tenHours) {
				return true;
			} else {
				return {
					progressPercentage: state.index.timePlayed / tenHours,
					progress: state.index.timePlayed,
					maxProgress: tenHours,
				};
			}
		},
		reward: {
			rewardType: "x2 Currency",
			amount: 30,
		},
	},
	{
		id: 7,
		name: "Play for 25 hours",
		progress: (state): AccoladeCompletion => {
			const minute = 60; // in seconds
			const hour = minute * 60; // in seconds;
			const twentyFiveHours = 25 * hour;

			if (state.index.timePlayed >= twentyFiveHours) {
				return true;
			} else {
				return {
					progressPercentage: state.index.timePlayed / twentyFiveHours,
					progress: state.index.timePlayed,
					maxProgress: twentyFiveHours,
				};
			}
		},
		reward: {
			rewardType: "x2 Currency",
			amount: 60,
		},
	},
	{
		id: 8,
		name: "Play for 50 hours",
		progress: (state): AccoladeCompletion => {
			const minute = 60; // in seconds
			const hour = minute * 60; // in seconds;
			const fiftyHours = 50 * hour;

			if (state.index.timePlayed >= fiftyHours) {
				return true;
			} else {
				return {
					progressPercentage: state.index.timePlayed / fiftyHours,
					progress: state.index.timePlayed,
					maxProgress: fiftyHours,
				};
			}
		},
		reward: {
			rewardType: "x2 Currency",
			amount: 120,
		},
	},
	{
		id: 9,
		name: "Play for 100 hours",
		progress: (state): AccoladeCompletion => {
			const minute = 60; // in seconds
			const hour = minute * 60; // in seconds;
			const oneHundredHours = hour * 100;

			if (state.index.timePlayed >= oneHundredHours) {
				return true;
			} else {
				return {
					progressPercentage: state.index.timePlayed / oneHundredHours,
					progress: state.index.timePlayed,
					maxProgress: oneHundredHours,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 30,
		},
	},
	{
		id: 10,
		name: "Play for 250 hours",
		progress: (state): AccoladeCompletion => {
			const minute = 60; // in seconds
			const hour = minute * 60; // in seconds;
			const twoHundredFiftyHours = hour * 250;

			if (state.index.timePlayed >= twoHundredFiftyHours) {
				return true;
			} else {
				return {
					progressPercentage: state.index.timePlayed / twoHundredFiftyHours,
					progress: state.index.timePlayed,
					maxProgress: twoHundredFiftyHours,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 30,
		},
	},
	{
		id: 11,
		name: "Play for 500 hours",
		progress: (state): AccoladeCompletion => {
			const minute = 60; // in seconds
			const hour = minute * 60; // in seconds;
			const fiveHundredFiftyHours = hour * 500;

			if (state.index.timePlayed >= fiveHundredFiftyHours) {
				return true;
			} else {
				return {
					progressPercentage: state.index.timePlayed / fiveHundredFiftyHours,
					progress: state.index.timePlayed,
					maxProgress: fiveHundredFiftyHours,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 60,
		},
	},
	{
		id: 12,
		name: "Play for 1,000 hours",
		progress: (state): AccoladeCompletion => {
			const minute = 60; // in seconds
			const hour = minute * 60; // in seconds;
			const oneThousandHours = hour * 1000;

			if (state.index.timePlayed >= oneThousandHours) {
				return true;
			} else {
				return {
					progressPercentage: state.index.timePlayed / oneThousandHours,
					progress: state.index.timePlayed,
					maxProgress: oneThousandHours,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 120,
		},
	},
	{
		id: 13,
		name: "Own all zones from Ban Land",
		progress: (state): AccoladeCompletion => {
			const banLandData = state.worlds.find((world) => world.name === "Ban Land");
			if (banLandData === undefined) {
				return {
					progressPercentage: 0,
					progress: 0,
					maxProgress: 9,
				};
			}

			let totalZones = 0;
			let ownedZones = 0;
			for (const [zoneName, zoneData] of pairs(zones)) {
				if (zoneData.worldParent !== "Ban Land") {
					continue;
				}

				totalZones += 1;

				const storedZoneData = banLandData.zones.find((name) => name === zoneName);
				if (storedZoneData !== undefined) {
					ownedZones += 1;
				}
			}

			if (ownedZones >= totalZones) {
				return true;
			} else {
				return {
					progressPercentage: ownedZones / totalZones,
					progress: ownedZones,
					maxProgress: totalZones,
				};
			}
		},
		reward: {
			rewardType: "x2 Rank Experience",
			amount: 60,
		},
	},
	{
		id: 14,
		name: "Own every weapon from Ban Land",
		progress: (state): AccoladeCompletion => {
			let totalWeapons = 0;
			let ownedWeapons = 0;

			for (const [, data] of pairs(WEAPONS)) {
				if (data.world === "Ban Land") {
					totalWeapons += 1;

					if (state.weapons.find((weaponId) => weaponId.id === data.id)) {
						ownedWeapons += 1;
					}
				}
			}

			if (ownedWeapons >= totalWeapons) {
				return true;
			} else {
				return {
					progressPercentage: ownedWeapons / totalWeapons,
					progress: ownedWeapons,
					maxProgress: totalWeapons,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 60,
		},
	},
	{
		id: 15,
		name: "Redeem 5 codes",
		progress: (state): AccoladeCompletion => {
			const codesRedeemed = state.media.codes.size();
			if (codesRedeemed >= 5) {
				return true;
			} else {
				return {
					progressPercentage: codesRedeemed / 5,
					progress: codesRedeemed,
					maxProgress: 5,
				};
			}
		},
		reward: {
			rewardType: "x2 Pet Experience",
			amount: 15,
		},
	},
	{
		id: 16,
		name: "Redeem 10 codes",
		progress: (state): AccoladeCompletion => {
			const codesRedeemed = state.media.codes.size();
			if (codesRedeemed >= 10) {
				return true;
			} else {
				return {
					progressPercentage: codesRedeemed / 10,
					progress: codesRedeemed,
					maxProgress: 10,
				};
			}
		},
		reward: {
			rewardType: "x2 Pet Experience",
			amount: 30,
		},
	},
	{
		id: 17,
		name: "Redeem 15 codes",
		progress: (state): AccoladeCompletion => {
			const codesRedeemed = state.media.codes.size();
			if (codesRedeemed >= 15) {
				return true;
			} else {
				return {
					progressPercentage: codesRedeemed / 15,
					progress: codesRedeemed,
					maxProgress: 15,
				};
			}
		},
		reward: {
			rewardType: "x2 Pet Experience",
			amount: 30,
		},
	},
	{
		id: 18,
		name: "Redeem 30 codes",
		progress: (state): AccoladeCompletion => {
			const codesRedeemed = state.media.codes.size();
			if (codesRedeemed >= 30) {
				return true;
			} else {
				return {
					progressPercentage: codesRedeemed / 30,
					progress: codesRedeemed,
					maxProgress: 30,
				};
			}
		},
		reward: {
			rewardType: "x2 Pet Experience",
			amount: 60,
		},
	},
	{
		id: 19,
		name: "Reach wave 10 in GearWorx Time Trials (Hard Mode)",
		progress: (state): AccoladeCompletion => {
			const highestHardWave = state.timeTrials["Ban Land"].highestHardWave;
			if (highestHardWave >= 10) {
				return true;
			} else {
				return {
					progressPercentage: highestHardWave / 10,
					progress: highestHardWave,
					maxProgress: 10,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 30,
		},
	},
	{
		id: 20,
		name: "Reach wave 20 in GearWorx Time Trials (Hard Mode)",
		progress: (state): AccoladeCompletion => {
			const highestHardWave = state.timeTrials["Ban Land"].highestHardWave;
			if (highestHardWave >= 20) {
				return true;
			} else {
				return {
					progressPercentage: highestHardWave / 20,
					progress: highestHardWave,
					maxProgress: 20,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 60,
		},
	},
	{
		id: 21,
		name: "Reach wave 35 in GearWorx Time Trials (Hard Mode)",
		progress: (state): AccoladeCompletion => {
			const highestHardWave = state.timeTrials["Ban Land"].highestHardWave;
			if (highestHardWave >= 35) {
				return true;
			} else {
				return {
					progressPercentage: highestHardWave / 35,
					progress: highestHardWave,
					maxProgress: 35,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 120,
		},
	},
	{
		id: 22,
		name: "Reach wave 45 in GearWorx Time Trials (Hard Mode)",
		progress: (state): AccoladeCompletion => {
			const highestHardWave = state.timeTrials["Ban Land"].highestHardWave;
			if (highestHardWave >= 45) {
				return true;
			} else {
				return {
					progressPercentage: highestHardWave / 45,
					progress: highestHardWave,
					maxProgress: 45,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 120,
		},
	},
	{
		id: 23,
		name: "Reach wave 60 in GearWorx Time Trials (Hard Mode)",
		progress: (state): AccoladeCompletion => {
			const highestHardWave = state.timeTrials["Ban Land"].highestHardWave;
			if (highestHardWave >= 60) {
				return true;
			} else {
				return {
					progressPercentage: highestHardWave / 60,
					progress: highestHardWave,
					maxProgress: 60,
				};
			}
		},
		reward: {
			rewardType: "x2 Hatching Luck",
			amount: 120,
		},
	},
];
/* eslint-enable jsdoc/require-jsdoc */
