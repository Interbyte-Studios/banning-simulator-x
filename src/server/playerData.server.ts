import { GameAnalytics } from "@rbxts/gameanalytics";
import { deepEquals } from "@rbxts/object-utils";
import ProfileService from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { HttpService, Players } from "@rbxts/services";
import { STORE_SCOPE } from "shared/configs/game";

import { deserialize, ProfileState, profileTemplate, serialize } from "./modules/datastore/serde";
import { createPlayerStore, removeStore, retrieveStore } from "./playerStore";

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

const profiles: Map<Player, Profile<ProfileState>> = new Map();

/**
 * Attempts to initialize a game state for a player that just joined.
 *
 * Fires off data retrieval and Rodux store creation.
 *
 * @param player The player that joined.
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
	profile.Reconcile();
	profiles.set(player, profile);

	profile.ListenToRelease(() => {
		player.Kick(`There was an issue. Please rejoin.`);
	});

	// create the store
	createPlayerStore(player, deserialize(profile.Data));
}

/**
 * Attempts to save a player's profile to the DataStore.
 *
 * If the player does not have a profile, no errors are thrown, as this could be the second time we attempt to save the user's data.
 *
 * A player should be evicted from the game after their profile is released to avoid progression lost.
 *
 * @param player The player to save data for.
 */
async function savePlayerData(player: Player): Promise<void> {
	// retrieve the profile and remove it from the cache to avoid the player having a double save
	const profile = profiles.get(player);
	if (profile === undefined) {
		return;
	}

	profiles.delete(player);

	const [getStoreSuccess, store] = pcall(retrieveStore, player);
	if (!getStoreSuccess) {
		GameAnalytics.addErrorEvent(player.UserId, {
			severity: "error",
			message: `Failed to retrieve store when saving player data`,
		});

		profile.Release();
		return;
	}

	// check that serialize -> deserialize isn't lossy
	const state = store.getState();
	if (!deepEquals(state, deserialize(serialize(state)))) {
		const warningMessage = `Player ${player.UserId} has lossy serialize -> Deserialize procedure.
		Data before:
		${HttpService.JSONEncode(state)}
		Data after:
		${HttpService.JSONEncode(deserialize(serialize(state)))}`;

		warn(warningMessage);
		GameAnalytics.addErrorEvent(player.UserId, {
			severity: "critical",
			message: warningMessage,
		});
	}

	// serialize the player's data
	profile.Data = serialize(state);
	// release the profile lock
	profile.Release();

	// remove the store
	removeStore(player);
}

Players.PlayerRemoving.Connect(async (player) => {
	await savePlayerData(player);
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
