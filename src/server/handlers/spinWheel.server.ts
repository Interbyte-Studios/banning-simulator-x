import { HttpService, Players, RunService } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { hatchHatchableEgg } from "server/modules/pets/hatchEgg";
import { onStoreCreated } from "server/playerStore";
import { isEggName } from "shared/configs/eggs";
import { CURRENCY_PURCHASES, isBoost } from "shared/configs/game";
import { isWheelSpinCurrencyReward, isWheelSpinPetReward, WHEEL_SPIN } from "shared/configs/wheelSpin";
import { WORLDS } from "shared/configs/worlds";
import { zones } from "shared/configs/zones";
import { remotes } from "shared/remotes";
import { Store } from "shared/rodux";
import { storeBoost } from "shared/rodux/boosts";
import { awardCurrency } from "shared/rodux/currencies";
import { hatchEgg } from "shared/rodux/eggs";
import { addPets, Pet } from "shared/rodux/pets";
import { addAvailableSpins, spinTheWheel } from "shared/rodux/spinWheel";

const random = new Random();

/**
 * Remotes.
 */
const eggsNamespace = remotes.Server.GetNamespace("eggs");
const conveyHatchRemote = eggsNamespace.Get("conveyHatch");

const spinWheelRemote = remotes.Server.Get("spinWheel");

/**
 * @param player The player!
 */
async function handlePlayer(player: Player): Promise<void> {
	const store = await onStoreCreated(player);

	let lastCheck = 0;
	const connection = RunService.Heartbeat.Connect(() => {
		// only run once a second!
		const now = time();
		if (now - lastCheck < 1) {
			return;
		}
		lastCheck = now;

		// check that they're still in the game!
		if (!player.IsDescendantOf(Players)) {
			connection.Disconnect();
			return;
		}

		// If they already have spins, we shouldn't award them any.
		if (store.getState().spinWheel.spinsAvailable > 0) {
			return;
		}

		// Boooooyaaaaaa!
		const nowTimestamp = DateTime.now().UnixTimestamp;
		const lastClaimTime = store.getState().spinWheel.lastSpinTime;
		if (nowTimestamp >= lastClaimTime + 86400) {
			store.dispatch(addAvailableSpins(1));
		}
	});
}

/**
 * Attempts to spin the wheel.
 *
 * @param player The player!
 * @param store The player's store.
 * @returns The reward won.
 */
function spinWheel(player: Player, store: Store): number | undefined {
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
				const hatchedEggs = hatchHatchableEgg(player, currentState, spinReward.reward, 1, "regular");

				store.dispatch(hatchEgg(0, "coins", hatchedEggs));
				conveyHatchRemote.SendToPlayer(player, spinReward.reward, hatchedEggs, false);
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
}

/**
 * When a player requests to spin the wheel... Spin the wheel!
 */
spinWheelRemote.SetCallback(withPlayerStore((player, store) => spinWheel(player, store)));

/**
 * Run `handlePlayer` for players already in the game.
 */
Players.GetPlayers().forEach(handlePlayer);

/**
 * Run `handlePlayer` for new players.
 */
Players.PlayerAdded.Connect(handlePlayer);
