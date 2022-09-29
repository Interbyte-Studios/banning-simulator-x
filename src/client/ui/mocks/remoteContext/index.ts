import { createContext } from "@rbxts/roact";
import { RedeemCodeDefinition } from "shared/remotes/media/redeemCode";
import { VerifyDiscordDefinition } from "shared/remotes/media/verifyDiscord";
import { PurchaseZoneDefinition } from "shared/remotes/purchaseZone";
import { RedeemQuestDefinition } from "shared/remotes/redeemQuest";
import { ToggleAutoDeleteDefinition } from "shared/remotes/settings/autoDelete/toggleAutoDelete";
import { ToggleEasyLegendariesAutoDeleteDefinition } from "shared/remotes/settings/autoDelete/toggleEasyLegendariesAutoDelete";
import { ToggleAutoHatchDefinition } from "shared/remotes/settings/gameplay/toggleAuto";
import { ToggleWalkSpeedDefinition } from "shared/remotes/settings/gameplay/toggleWalkSpeed";
import { ToggleButtonClickDefinition } from "shared/remotes/settings/sound/toggleButtonClick";
import { ToggleMusicVolumeDefinition } from "shared/remotes/settings/sound/toggleMusicVolume";
import { ToggleSoundEffectsVolumeDefinition } from "shared/remotes/settings/sound/toggleSoundEffectsVolume";
import { ToggleGraphicsDefinition } from "shared/remotes/settings/visual/toggleGraphics";
import { TogglePetAnimationTypeDefinition } from "shared/remotes/settings/visual/togglePetAnimationType";
import { TogglePetsDisplayedDefinition } from "shared/remotes/settings/visual/togglePetsDisplayed";
import { TogglePetsStudsOfDistanceDefinition } from "shared/remotes/settings/visual/togglePetsStudsOfDistance";
import { ToggleTimeOfDayDefinition } from "shared/remotes/settings/visual/toggleTimeOfDay";
import { EquipTalismanDefinition } from "shared/remotes/talismans/equipTalisman";
import { PurchaseTalismanDefinition } from "shared/remotes/talismans/purchaseTalisman";
import { UnlockRankDefinition } from "shared/remotes/unlockRank";
import { ChangeWeaponDefinition } from "shared/remotes/weapons/changeWeapon";
import { EquipWeaponDefinition } from "shared/remotes/weapons/equipWeapon";
import { PurchaseWeaponDefinition } from "shared/remotes/weapons/purchaseWeapon";
import { UnequipWeaponDefinition } from "shared/remotes/weapons/unequipWeapon";

import { fakeHatchEgg } from "../hatchEgg";
import { fakeFunctionCall } from "./fakeFunctionCall";
import { fakeRemoteCall } from "./fakeRemoteCall";

export const fakeRemoteContext = {
	changeWeapon: fakeRemoteCall<ChangeWeaponDefinition>("changeWeapon"),
	equipWeapon: fakeRemoteCall<EquipWeaponDefinition>("equipWeapon"),
	unequipWeapon: fakeRemoteCall<UnequipWeaponDefinition>("unequipWeapon"),
	purchaseWeapon: fakeRemoteCall<PurchaseWeaponDefinition>("purchaseWeapon"),

	purchaseZone: fakeFunctionCall<PurchaseZoneDefinition>("purchaseZone", () => {
		return {
			success: true,
		};
	}),

	toggleAuto: fakeRemoteCall<ToggleAutoHatchDefinition>("toggleAuto"),
	toggleAutoDelete: fakeRemoteCall<ToggleAutoDeleteDefinition>("toggleAutoDelete"),
	toggleEasyLegendariesAutoDelete: fakeRemoteCall<ToggleEasyLegendariesAutoDeleteDefinition>(
		"toggleEasyLegendariesAutoDelete",
	),

	redeemCode: fakeFunctionCall<RedeemCodeDefinition>("redeemCode", () => {
		return {
			success: true,
		};
	}),
	redeemQuest: fakeRemoteCall<RedeemQuestDefinition>("redeemQuest"),
	toggleWalkSpeed: fakeRemoteCall<ToggleWalkSpeedDefinition>("toggleWalkSpeed"),
	toggleButtonClickSFX: fakeRemoteCall<ToggleButtonClickDefinition>("toggleButtonClickSFX"),
	toggleMusicVolume: fakeRemoteCall<ToggleMusicVolumeDefinition>("toggleMusicVolume"),
	toggleSoundEffectsVolume: fakeRemoteCall<ToggleSoundEffectsVolumeDefinition>("toggleSoundEffectsVolume"),
	toggleGraphics: fakeRemoteCall<ToggleGraphicsDefinition>("toggleGraphics"),
	togglePetAnimationType: fakeRemoteCall<TogglePetAnimationTypeDefinition>("togglePetAnimationType"),
	togglePetsDisplayed: fakeRemoteCall<TogglePetsDisplayedDefinition>("togglePetsDisplayed"),
	togglePetsStudsOfDistance: fakeRemoteCall<TogglePetsStudsOfDistanceDefinition>("togglePetsStudsOfDistance"),
	toggleTimeOfDay: fakeRemoteCall<ToggleTimeOfDayDefinition>("toggleTimeOfDay"),
	verifyDiscord: fakeFunctionCall<VerifyDiscordDefinition>("verifyDiscord", () => {
		return {
			success: true,
		};
	}),

	purchaseTalisman: fakeRemoteCall<PurchaseTalismanDefinition>("purchaseTalisman"),
	equipTalisman: fakeRemoteCall<EquipTalismanDefinition>("equipTalisman"),

	unlockRank: fakeRemoteCall<UnlockRankDefinition>("unlockRank"),

	hatchEgg: fakeHatchEgg,
};

export const remoteContext = createContext(fakeRemoteContext);
