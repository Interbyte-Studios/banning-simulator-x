import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { hatchGameEgg } from "server/modules/pets/hatchEgg";
import { LIMITED_EGG } from "shared/configs/game";
import { WORLDS } from "shared/configs/worlds";
import { zones } from "shared/configs/zones";
import { remotes } from "shared/remotes";
import { storeBoost } from "shared/rodux/boosts";
import { awardCurrency } from "shared/rodux/currencies";
import { claimDailyRewards } from "shared/rodux/dailyRewards";
import { hatchEgg } from "shared/rodux/eggs";
import { HatchedPet } from "shared/rodux/pets";

const claimDailyRewardsRemote = remotes.Server.Get("claimDailyRewards");

const eggsNamespace = remotes.Server.GetNamespace("eggs");
const conveyHatch = eggsNamespace.Get("conveyHatch");

claimDailyRewardsRemote.Connect(
	withPlayerStore((player, store) => {
		debug.setmemorycategory("dailyRewards");
		const currentState = store.getState();

		const now = os.time();
		const canClaim = now - currentState.dailyRewards.lastClaimed >= 86400;
		if (!canClaim) {
			return;
		}

		const daysClaimed = currentState.dailyRewards.daysClaimed.size();
		const newDay = daysClaimed + 1;
		switch (newDay) {
			case 1: {
				// bag of coins
				let highestIndex = 0;
				let highestReward = 0;
				for (const [worldName, worldData] of pairs(WORLDS)) {
					const storedWorld = store.getState().worlds.find((world) => world.name === worldName);
					if (storedWorld === undefined) {
						continue;
					}

					if (worldData.reward !== "coins") {
						continue;
					}

					for (const [zoneName, zoneData] of pairs(zones)) {
						if (zoneData.worldParent !== worldName) {
							continue;
						}

						const storedZone = storedWorld.zones.find((zone) => zone === zoneName);
						if (storedZone === undefined) {
							continue;
						}

						if (zoneData.id > highestIndex) {
							highestIndex = zoneData.id;
							highestReward = zoneData.npcs.filter((npc) => npc.isBoss)[0].reward.currency;
						}
					}
				}
				store.dispatch(awardCurrency("coins", highestReward * 9));
				break;
			}
			case 2: {
				// 2 hour currency boost
				store.dispatch(storeBoost("x2 Currency", 120));
				break;
			}
			case 3: {
				const hatchedPet = hatchGameEgg(currentState, LIMITED_EGG, "regular");

				// log pet
				const storedPet: HatchedPet = {
					...hatchedPet.pet,
					autoDeleted: currentState.settings.autoDelete.includes(hatchedPet.pet.id),
					magicPet: hatchedPet.isMagic,
				};
				store.dispatch(hatchEgg(0, "coins", [storedPet]));

				conveyHatch.SendToPlayer(player, LIMITED_EGG, [storedPet]);
				break;
			}
			case 4: {
				// 2 hour luck boost
				store.dispatch(storeBoost("x2 Hatching Luck", 120));
				break;
			}
			case 5: {
				// 2 hour pet experience boost
				store.dispatch(storeBoost("x2 Pet Experience", 120));
				break;
			}
			case 6: {
				// chest of coins
				let highestIndex = 0;
				let highestReward = 0;
				for (const [worldName, worldData] of pairs(WORLDS)) {
					const storedWorld = store.getState().worlds.find((world) => world.name === worldName);
					if (storedWorld === undefined) {
						continue;
					}

					if (worldData.reward !== "coins") {
						continue;
					}

					for (const [zoneName, zoneData] of pairs(zones)) {
						if (zoneData.worldParent !== worldName) {
							continue;
						}

						const storedZone = storedWorld.zones.find((zone) => zone === zoneName);
						if (storedZone === undefined) {
							continue;
						}

						if (zoneData.id > highestIndex) {
							highestIndex = zoneData.id;
							highestReward = zoneData.npcs.filter((npc) => npc.isBoss)[0].reward.currency;
						}
					}
				}
				store.dispatch(awardCurrency("coins", highestReward * 27));
				break;
			}
			case 7: {
				const hatchedPet = hatchGameEgg(currentState, LIMITED_EGG, "regular");

				// log pet
				const storedPet: HatchedPet = {
					...hatchedPet.pet,
					autoDeleted: currentState.settings.autoDelete.includes(hatchedPet.pet.id),
					magicPet: hatchedPet.isMagic,
				};
				store.dispatch(hatchEgg(0, "coins", [storedPet]));

				conveyHatch.SendToPlayer(player, LIMITED_EGG, [storedPet]);
				break;
			}
		}

		store.dispatch(claimDailyRewards(now));
	}),
);
