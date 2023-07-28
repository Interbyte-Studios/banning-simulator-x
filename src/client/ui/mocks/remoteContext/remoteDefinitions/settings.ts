import { AddOrRemoveToAutoDeleteDefinition } from "shared/remotes/settings/autoDelete/toggleAutoDelete";
import { ToggleAutoHatchDefinition } from "shared/remotes/settings/gameplay/toggleAuto";
import { ToggleWalkSpeedDefinition } from "shared/remotes/settings/gameplay/toggleWalkSpeed";
import { TogglePublicInventoryDefinition } from "shared/remotes/settings/privacy/publicInventory";
import { TogglePublicTradeHistoryDefinition } from "shared/remotes/settings/privacy/publicTradeHistory";
import { ToggleTradesEnabledDefinition } from "shared/remotes/settings/privacy/tradesEnabled";
import { ToggleButtonClickDefinition } from "shared/remotes/settings/sound/toggleButtonClick";
import { ToggleMusicVolumeDefinition } from "shared/remotes/settings/sound/toggleMusicVolume";
import { ToggleSoundEffectsVolumeDefinition } from "shared/remotes/settings/sound/toggleSoundEffectsVolume";
import { ToggleGraphicsDefinition } from "shared/remotes/settings/visual/toggleGraphics";
import { TogglePetAnimationTypeDefinition } from "shared/remotes/settings/visual/togglePetAnimationType";
import { TogglePetsDisplayedDefinition } from "shared/remotes/settings/visual/togglePetsDisplayed";
import { TogglePetsStudsOfDistanceDefinition } from "shared/remotes/settings/visual/togglePetsStudsOfDistance";
import { ToggleTimeOfDayDefinition } from "shared/remotes/settings/visual/toggleTimeOfDay";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the settings remote functions.
 */
export const settingsRemoteContext = {
	toggleWalkSpeed: fakeRemoteCall<ToggleWalkSpeedDefinition>("toggleWalkSpeed"),
	toggleButtonClickSFX: fakeRemoteCall<ToggleButtonClickDefinition>("toggleButtonClickSFX"),
	toggleMusicVolume: fakeRemoteCall<ToggleMusicVolumeDefinition>("toggleMusicVolume"),
	toggleSoundEffectsVolume: fakeRemoteCall<ToggleSoundEffectsVolumeDefinition>("toggleSoundEffectsVolume"),
	toggleGraphics: fakeRemoteCall<ToggleGraphicsDefinition>("toggleGraphics"),
	togglePetAnimationType: fakeRemoteCall<TogglePetAnimationTypeDefinition>("togglePetAnimationType"),
	togglePetsDisplayed: fakeRemoteCall<TogglePetsDisplayedDefinition>("togglePetsDisplayed"),
	togglePetsStudsOfDistance: fakeRemoteCall<TogglePetsStudsOfDistanceDefinition>("togglePetsStudsOfDistance"),
	toggleTimeOfDay: fakeRemoteCall<ToggleTimeOfDayDefinition>("toggleTimeOfDay"),
	togglePublicInventory: fakeRemoteCall<TogglePublicInventoryDefinition>("togglePublicInventory"),
	togglePublicTradeHistory: fakeRemoteCall<TogglePublicTradeHistoryDefinition>("togglePublicTradeHistory"),
	tradesEnabled: fakeRemoteCall<ToggleTradesEnabledDefinition>("tradesEnabled"),
	toggleAuto: fakeRemoteCall<ToggleAutoHatchDefinition>("toggleAuto"),
	addOrRemoveToAutoDelete: fakeRemoteCall<AddOrRemoveToAutoDeleteDefinition>("addOrRemoveToAutoDelete"),
};
