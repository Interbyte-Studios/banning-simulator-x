import { HttpService, Players } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { hatchHatchableEgg } from "server/modules/pets/hatchEgg";
import { onStoreCreated } from "server/playerStore";
import { isEggName } from "shared/configs/eggs";
import { CURRENCY_PURCHASES, isBoost } from "shared/configs/game";
import { TIME_TRIAL_EGG } from "shared/configs/timeTrials";
import { isWheelSpinCurrencyReward, isWheelSpinPetReward, WHEEL_SPIN } from "shared/configs/wheelSpin";
import { WORLDS } from "shared/configs/worlds";
import { zones } from "shared/configs/zones";
import { remotes } from "shared/remotes";
import { storeBoost } from "shared/rodux/boosts";
import { awardCurrency } from "shared/rodux/currencies";
import { hatchEgg } from "shared/rodux/eggs";
import { addPets, Pet } from "shared/rodux/pets";
import { addAvailableSpins, spinTheWheel } from "shared/rodux/spinWheel";

const random = new Random();

const eggsNamespace = remotes.Server.GetNamespace("eggs");
const conveyHatch = eggsNamespace.Get("conveyHatch");

const spinWheel = remotes.Server.Get("spinWheel");
spinWheel.SetCallback(
	withPlayerStore((player, store) => {
		const currentState = store.getState();

		const spinWheel = currentState.spinWheel;
		if (spinWheel.spinsAvailable <= 0 && spinWheel.purchasedSpinsAvailable <= 0) {
			return;
		}

		let usingPurchasedSpin = false;
		if (spinWheel.purchasedSpinsAvailable > 0) {
			usingPurchasedSpin = true;
		}

		const currentTime = DateTime.now().UnixTimestamp;
		const randomNum = random.NextNumber(0, 100);

		let chosenReward = 0;
		let cumulativeChance = 0;
		for (let i = 1; i <= WHEEL_SPIN.size(); i++) {
			const spinReward = WHEEL_SPIN.find((reward) => reward.id === i);
			if (spinReward === undefined) {
				throw `Did not find spin reward with id: ${i}`;
			}

			cumulativeChance += spinReward.chance;

			if (randomNum <= cumulativeChance) {
				chosenReward = spinReward.id;
				if (isEggName(spinReward.reward)) {
					const hatchedEggs = hatchHatchableEgg(player, currentState, TIME_TRIAL_EGG, 1, "regular");

					store.dispatch(hatchEgg(0, "coins", hatchedEggs));
					conveyHatch.SendToPlayer(player, spinReward.reward, hatchedEggs, false);
					break;
				} else if (isWheelSpinPetReward(spinReward.reward)) {
					const newPet: Pet = {
						id: spinReward.reward.petId,
						guid: HttpService.GenerateGUID(false),
						bans: 0,
						equipped: false,
						locked: false,
						variant: "regular",
						tradeLocked: false,
					};
					store.dispatch(addPets([newPet]));
					break;
				} else if (isWheelSpinCurrencyReward(spinReward.reward)) {
					let highestIndex = 0;
					let highestReward = 0;
					for (const [worldName, worldData] of pairs(WORLDS)) {
						const storedWorld = currentState.worlds.find((world) => world.name === worldName);
						if (storedWorld === undefined) {
							continue;
						}

						if (spinReward.reward.name === "gems" && worldData.id > highestIndex) {
							highestIndex = worldData.id;
							highestReward = highestIndex * 3000;
						}

						if (worldData.reward !== spinReward.reward.name) {
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

					const currencyOption = CURRENCY_PURCHASES[spinReward.reward.name][spinReward.reward.tier];
					store.dispatch(awardCurrency(spinReward.reward.name, highestReward * currencyOption.highestZoneMultiplier));
					break;
				} else if (isBoost(spinReward.reward)) {
					store.dispatch(storeBoost(spinReward.reward, 30));
					break;
				}
			}
		}

		store.dispatch(spinTheWheel(currentTime, usingPurchasedSpin));
		return chosenReward;
	}),
);

/**
 * Called when a player joins the game.
 *
 * @param player The player that joined.
 */
async function onPlayerAdded(player: Player): Promise<void> {
	const store = await onStoreCreated(player);

	task.spawn(() => {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			task.wait(1);
			if (store.getState().spinWheel.spinsAvailable > 0) {
				continue;
			}

			const now = DateTime.now().UnixTimestamp;
			const lastClaimTime = store.getState().spinWheel.lastSpinTime;
			if (now >= lastClaimTime + 86400) {
				store.dispatch(addAvailableSpins(1));
			}
		}
	});
}

Players.GetPlayers().forEach(onPlayerAdded);
Players.PlayerAdded.Connect(onPlayerAdded);
