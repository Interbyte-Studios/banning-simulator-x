import { Players, RunService } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { onStoreCreated } from "server/playerStore";
import { BoostProduct } from "shared/configs/game";
import { remotes } from "shared/remotes";
import { Store } from "shared/rodux";
import { claimBoost, useBoosts, ValidBoostTime, ValidBoostUseRecord } from "shared/rodux/boosts";
import { getBoostMastery } from "shared/util/getBoostMastery";

const useBoostRemote = remotes.Server.Get("useBoost");

/**
 * Handles boost timers.
 *
 * @param player The player.
 * @returns An empty promise.
 */
const handlePlayer = async (player: Player): Promise<void> =>
	onStoreCreated(player)
		.andThen((store) => {
			let lastCheck = 0;
			const connection = RunService.Heartbeat.Connect(() => {
				// only check once a second
				const now = time();
				if (now - lastCheck < 1) {
					return;
				}
				lastCheck = now;

				// first gotta check that they're still in the game!
				if (!player.IsDescendantOf(Players)) {
					connection.Disconnect();
					return;
				}

				// get player state
				const currentState = store.getState();

				// get the boosts the player is actively using
				const activeBoosts: ValidBoostUseRecord = [];
				for (const [name, timer] of pairs(currentState.boosts.active)) {
					if (timer < 0) {
						continue;
					}

					activeBoosts.push(name);
				}

				// subtract a second from the timer
				store.dispatch(useBoosts(activeBoosts));
			});
		})
		.catch((e) => {
			throw `Failed to handle boosts for player ${player.Name}. Error: ${e}`;
		});

/**
 * Uses a specified boost if the specified player has one available.
 *
 * @param store The player store.
 * @param boostName The name of the boost.
 * @param boostTime The time of boost.
 */
const useBoost = (store: Store, boostName: BoostProduct, boostTime: ValidBoostTime): void => {
	// get store state
	const currentState = store.getState();

	// check that they have a boost they can use
	if (!(currentState.boosts.storage[boostName][boostTime] > 0)) {
		return;
	}

	const extendedBoostMultiplier = getBoostMastery(currentState.boosts);
	store.dispatch(claimBoost(boostName, boostTime, extendedBoostMultiplier.extendedDurationMultiplier));
};

/**
 * When they'd like to use a boost.
 */
useBoostRemote.Connect(withPlayerStore((_, store, boostName, boostTime) => useBoost(store, boostName, boostTime)));

/**
 * Handle players who were in game before script ran.
 */
Players.GetPlayers().forEach(handlePlayer);

/**
 * Handle new players.
 */
Players.PlayerAdded.Connect(handlePlayer);
