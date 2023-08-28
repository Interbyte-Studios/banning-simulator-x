import { HttpService } from "@rbxts/services";
import { modifyPetCount } from "server/modules/datastore/pets";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { LIMITED_EGG } from "shared/configs/game";
import { WORLDS } from "shared/configs/worlds";
import { zones } from "shared/configs/zones";
import { remotes } from "shared/remotes";
import { storeBoost } from "shared/rodux/boosts";
import { awardCurrency } from "shared/rodux/currencies";
import { claimDailyRewards } from "shared/rodux/dailyRewards";
import { addPets } from "shared/rodux/pets";
import { getEggData } from "shared/util/getEggData";

const hatchSingleExclusive = remotes.Server.GetNamespace("eggs").Get("hatchSingleExclusiveEgg");

remotes.Server.Get("claimDailyRewards").Connect(
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
				// robux egg
				const randomObject = new Random();
				let selectedPet = 0;
				let chance = randomObject.NextNumber(0, 100);
				const eggData = getEggData(LIMITED_EGG);
				for (const [, petData] of pairs(eggData.pets)) {
					chance -= petData.chance;
					if (chance > 0) {
						continue;
					}

					selectedPet = petData.id;
					break;
				}

				store.dispatch(
					addPets([
						{
							id: selectedPet,
							variant: "regular",
							tradeLocked: false,
							guid: HttpService.GenerateGUID(false),
						},
					]),
				);

				modifyPetCount({
					type: "addPet",
					petId: selectedPet,
					variant: "regular",
				});

				hatchSingleExclusive.SendToPlayer(player, LIMITED_EGG, selectedPet);
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
				// robux egg
				const randomObject = new Random();
				let selectedPet = 0;
				let chance = randomObject.NextNumber(0, 100);
				const eggData = getEggData(LIMITED_EGG);
				for (const [, petData] of pairs(eggData.pets)) {
					chance -= petData.chance;
					if (chance > 0) {
						continue;
					}

					selectedPet = petData.id;
					break;
				}

				store.dispatch(
					addPets([
						{
							id: selectedPet,
							variant: "regular",
							tradeLocked: false,
							guid: HttpService.GenerateGUID(false),
						},
					]),
				);

				modifyPetCount({
					type: "addPet",
					petId: selectedPet,
					variant: "regular",
				});

				hatchSingleExclusive.SendToPlayer(player, LIMITED_EGG, selectedPet);
				break;
			}
		}

		store.dispatch(claimDailyRewards(now));
	}),
);
