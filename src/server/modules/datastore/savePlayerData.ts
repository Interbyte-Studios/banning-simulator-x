import { GameAnalytics } from "@rbxts/gameanalytics";
import { deepEquals } from "@rbxts/object-utils";
import { Profile } from "@rbxts/profileservice/globals";
import { HttpService } from "@rbxts/services";
import { removeStore, retrieveStore } from "server/playerStore";

import { deserialize, ProfileState, serialize } from "./serde";

const profiles: Map<Player, Profile<ProfileState>> = new Map();

/**
 * Retrieves a specific player's profile.
 *
 * @param player The player to get the profile for.
 * @returns The player's profile.
 */
export const getProfile = (player: Player): Profile<ProfileState> | undefined => {
	const profile = profiles.get(player);
	if (profile !== undefined) {
		return profile;
	}
};

/**
 * Sets a player's profile.
 *
 * @param player The player to set the profile for.
 * @param profile The profile to set.
 */
export const setProfile = (player: Player, profile: Profile<ProfileState>): void => {
	profiles.set(player, profile);
};

/**
 * Deletes a player's profile.
 *
 * @param player The player to delete the profile for.
 */
export const deleteProfile = (player: Player): void => {
	profiles.delete(player);
};

/**
 * Attempts to save a player's profile to the DataStore.
 *
 * If the player does not have a profile, no errors are thrown, as this could be the second time we attempt to save the user's data.
 *
 * A player should be evicted from the game after their profile is released to avoid progression lost.
 *
 * @param player The player to save data for.
 */
export async function savePlayerData(player: Player): Promise<void> {
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
