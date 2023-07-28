import { remotes } from "shared/remotes";

const remoteNamespace = remotes.Client.GetNamespace("settings");

/**
 * Remotes for settings.
 */
export const settingsRemotes = {
	toggleButtonClickSFX: remoteNamespace.GetNamespace("sound").Get("toggleButtonClick"),
	toggleMusicVolume: remoteNamespace.GetNamespace("sound").Get("toggleMusicVolume"),
	toggleSoundEffectsVolume: remoteNamespace.GetNamespace("sound").Get("toggleSoundEffectsVolume"),
	toggleAuto: remoteNamespace.GetNamespace("gameplay").Get("toggleAuto"),
	addOrRemoveToAutoDelete: remoteNamespace.GetNamespace("autoDelete").Get("addOrRemoveToAutoDelete"),
	toggleWalkSpeed: remoteNamespace.GetNamespace("gameplay").Get("toggleWalkSpeed"),
	toggleGraphics: remoteNamespace.GetNamespace("visual").Get("toggleGraphics"),
	togglePetAnimationType: remoteNamespace.GetNamespace("visual").Get("togglePetAnimationType"),
	togglePetsDisplayed: remoteNamespace.GetNamespace("visual").Get("togglePetsDisplayed"),
	togglePetsStudsOfDistance: remoteNamespace.GetNamespace("visual").Get("togglePetsStudsOfDistance"),
	toggleTimeOfDay: remoteNamespace.GetNamespace("visual").Get("toggleTimeOfDay"),
	togglePublicInventory: remoteNamespace.GetNamespace("privacy").Get("publicInventory"),
	togglePublicTradeHistory: remoteNamespace.GetNamespace("privacy").Get("publicTradeHistory"),
	tradesEnabled: remoteNamespace.GetNamespace("privacy").Get("tradesEnabled"),
};
