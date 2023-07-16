import { GameAnalytics } from "@rbxts/gameanalytics";
import ProfileService from "@rbxts/profileservice";
import { Players, RunService } from "@rbxts/services";
import { STORE_SCOPE } from "shared/configs/game";

import { deserialize } from "../shared/datastore/serde";
import { getServerDataVersion, hasExpectedDataVersion, runMigrations } from "./modules/datastore/migrations";
import { profileTemplate } from "./modules/datastore/profile";
import { deleteProfile, getProfile, savePlayerData, setProfile } from "./modules/datastore/savePlayerData";
import { createPlayerStore, removeStore } from "./playerStore";

/**
 * The data store used to save player data.
 */
const playerDataStore = ProfileService.GetProfileStore(
	{
		Name: "mainstore",
		Scope: STORE_SCOPE,
	},
	profileTemplate,
);

/**
 * If the current server is shutting down.
 *
 * In such a case, we reject all new incoming players.
 */
let IS_SHUTTING_DOWN = false;

/**
 * Attempts to initialize a game state for a player that just joined.
 *
 * Fires off data retrieval and Rodux store creation.
 *
 * @param player The player that joined.
 * @returns A promise that resolves once the data is loaded.
 */
async function onPlayerAdded(player: Player): Promise<void> {
	if (IS_SHUTTING_DOWN) {
		return player.Kick("The game is being updated. Please rejoin in a few minutes.");
	}

	const profile = playerDataStore.LoadProfileAsync(tostring(player.UserId));
	if (profile === undefined) {
		GameAnalytics.addErrorEvent(player.UserId, {
			severity: "error",
			message: "ProfileService failed to acquire lock on profile",
		});
		player.Kick("Failed to load your data. Please rejoin.");
		return;
	}

	if (!player.IsDescendantOf(Players)) {
		// player already left
		profile.Release();
		return;
	}

	profile.AddUserId(player.UserId);

	if (profile.Data.dataVersion === undefined) {
		// player existed before we had migration scripts
		// we set their version to v1
		profile.Data.dataVersion = 1;
	}

	profile.Data = runMigrations(profile.Data);

	if (!hasExpectedDataVersion(profile.Data)) {
		GameAnalytics.addErrorEvent(player.UserId, {
			severity: "error",
			message: `Attempt to join server with dataVersion ${
				profile.Data.dataVersion
			}, but we cannot process it (up to data version ${getServerDataVersion()}).`,
		});
		return player.Kick("This server may be outdated. Please rejoin.");
	}

	setProfile(player, profile);

	profile.ListenToRelease(() => {
		player.Kick(`There was an issue. Please rejoin.`);
	});

	// create the store
	createPlayerStore(player, deserialize(profile.Data));
}

Players.PlayerRemoving.Connect(async (player) => {
	if (IS_SHUTTING_DOWN) {
		return;
	}

	await savePlayerData(player);

	const profile = getProfile(player);
	if (profile === undefined) {
		GameAnalytics.addErrorEvent(player.UserId, {
			severity: "critical",
			message: "Failed to retrieve player store on `PlayerRemoving`.",
		});
		return;
	}
	deleteProfile(player);
	profile.Release();
	removeStore(player);
});

/**
 * The BindToClose event which saves all player data and kicks all players (soft shutdown implementation).
 */
game.BindToClose(() => {
	IS_SHUTTING_DOWN = true;

	const saveDataPromises = Players.GetPlayers().map(async (player) => {
		await savePlayerData(player);
		player.Kick(`The game is being updated. Please rejoin in a few minutes.`);
	});
	const [didSave, saveError] = Promise.all(saveDataPromises).await();
	if (!didSave) {
		GameAnalytics.addErrorEvent(0, {
			severity: "critical",
			message: `Failed to handle data saving during BindToClose:\n${saveError}`,
		});
	}
});

/**
 * Iterates over all players already in the game and creates a store for them.
 */
Players.GetPlayers().forEach(async (player) => {
	await onPlayerAdded(player);
});

/**
 * The PlayerAdded event which creates a store for the player.
 */
Players.PlayerAdded.Connect(async (player) => {
	await onPlayerAdded(player);
});

let lastSaveTime = 0;
while (RunService.Heartbeat.Wait()) {
	const now = time();
	if (now - lastSaveTime > 60) {
		lastSaveTime = now;

		// save data for all players
		for (const player of Players.GetPlayers()) {
			const [didSave, saveError] = pcall(savePlayerData, player);
			if (!didSave) {
				GameAnalytics.addErrorEvent(player.UserId, {
					severity: "critical",
					message: `Failed to handle data saving during Heartbeat:\n${saveError}`,
				});
			}
		}
	}
}
