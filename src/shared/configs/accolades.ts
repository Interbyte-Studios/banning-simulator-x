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
import { BAN_LAND_ZONES } from "./zones/banLand";

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
		id: 2,
		name: "Complete the Ban Land Pet Mastery",
		progress: (state): AccoladeCompletion => {
			let totalObjectives = 0;
			let completedObjectives = 0;

			for (const [, eggData] of pairs(EGGS)) {
				if (eggData.world !== "Ban Land") {
					continue;
				}

				for (const [, petData] of pairs(eggData.pets)) {
					totalObjectives += 7; // total objectives per pet

					const storedMasteryData = state.petMastery.get(tostring(petData.id));
					if (storedMasteryData === undefined) {
						continue;
					}

					if (storedMasteryData.radiant.fuseClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.radiant.maxLevelClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.void.fuseClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.void.maxLevelClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.void.hatchClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.regular.maxLevelClaimed) {
						completedObjectives += 1;
					}

					if (storedMasteryData.regular.hatchClaimed) {
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
		id: 3,
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
			rewardType: "x2 Currency",
			amount: 60,
		},
	},
	{
		id: 4,
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
			for (const [zoneName] of pairs(BAN_LAND_ZONES)) {
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
		id: 5,
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
		id: 6,
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
		id: 7,
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
		id: 8,
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
		id: 9,
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
		id: 10,
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
		id: 11,
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
];
/* eslint-enable jsdoc/require-jsdoc */
