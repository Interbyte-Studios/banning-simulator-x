import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { remotes } from "shared/remotes";

import { app as App } from "./app";
import { AnnouncementAPI } from "./context/AnnouncementsAPI";
import { remoteContext } from "./mocks/remoteContext";

const player = Players.LocalPlayer;
const playerGui = player.WaitForChild("PlayerGui");

const start = os.clock();
const secondLength = 1000;

onStoreCreated(player)
	.andThen((store) => {
		Roact.mount(
			<remoteContext.Provider
				value={{
					claimPetMastery: remotes.Client.GetNamespace("petMastery").Get("claimMastery"),
					togglePetMasteryCosmetic: remotes.Client.GetNamespace("petMastery").Get("toggleCosmetic"),

					changeWeapon: remotes.Client.GetNamespace("weapons").Get("changeWeapon"),
					equipWeapon: remotes.Client.GetNamespace("weapons").Get("equipWeapon"),
					unequipWeapon: remotes.Client.GetNamespace("weapons").Get("unequipWeapon"),
					purchaseWeapon: remotes.Client.GetNamespace("weapons").Get("purchaseWeapon"),
					hatchEgg: remotes.Client.GetNamespace("eggs").Get("hatchEgg"),
					purchaseZone: remotes.Client.Get("purchaseZone"),
					unlockRank: remotes.Client.Get("unlockRank"),
					deletePets: remotes.Client.GetNamespace("pets").Get("deletePets"),
					equipPets: remotes.Client.GetNamespace("pets").Get("equipPets"),
					lockPets: remotes.Client.GetNamespace("pets").Get("lockPets"),
					createPetTeam: remotes.Client.GetNamespace("pets").Get("createPetTeam"),
					deletePetTeam: remotes.Client.GetNamespace("pets").Get("deletePetTeam"),
					changePetTeamName: remotes.Client.GetNamespace("pets").Get("changePetTeamName"),
					redeemCode: remotes.Client.GetNamespace("media").Get("redeemCode"),
					redeemQuest: remotes.Client.Get("redeemQuest"),
					toggleButtonClickSFX: remotes.Client.GetNamespace("settings").GetNamespace("sound").Get("toggleButtonClick"),
					toggleMusicVolume: remotes.Client.GetNamespace("settings").GetNamespace("sound").Get("toggleMusicVolume"),
					toggleSoundEffectsVolume: remotes.Client.GetNamespace("settings")
						.GetNamespace("sound")
						.Get("toggleSoundEffectsVolume"),
					toggleAuto: remotes.Client.GetNamespace("settings").GetNamespace("gameplay").Get("toggleAuto"),
					toggleAutoDelete: remotes.Client.GetNamespace("settings").GetNamespace("autoDelete").Get("toggleAutoDelete"),
					toggleEasyLegendariesAutoDelete: remotes.Client.GetNamespace("settings")
						.GetNamespace("autoDelete")
						.Get("toggleEasyLegendariesAutoDelete"),
					toggleWalkSpeed: remotes.Client.GetNamespace("settings").GetNamespace("gameplay").Get("toggleWalkSpeed"),
					toggleGraphics: remotes.Client.GetNamespace("settings").GetNamespace("visual").Get("toggleGraphics"),
					togglePetAnimationType: remotes.Client.GetNamespace("settings")
						.GetNamespace("visual")
						.Get("togglePetAnimationType"),
					togglePetsDisplayed: remotes.Client.GetNamespace("settings")
						.GetNamespace("visual")
						.Get("togglePetsDisplayed"),
					togglePetsStudsOfDistance: remotes.Client.GetNamespace("settings")
						.GetNamespace("visual")
						.Get("togglePetsStudsOfDistance"),
					toggleTimeOfDay: remotes.Client.GetNamespace("settings").GetNamespace("visual").Get("toggleTimeOfDay"),
					purchaseTalisman: remotes.Client.GetNamespace("talismans").Get("purchaseTalisman"),
					equipTalisman: remotes.Client.GetNamespace("talismans").Get("equipTalisman"),
					spinWheel: remotes.Client.Get("spinWheel"),
					spinWheelInfo: remotes.Client.Get("spinWheelInfo"),
					unequipTalisman: remotes.Client.GetNamespace("talismans").Get("unequipTalisman"),
					verifyDiscord: remotes.Client.GetNamespace("media").Get("verifyDiscord"),
					equipTitle: remotes.Client.Get("equipTitle"),

					togglePublicInventory: remotes.Client.GetNamespace("settings").GetNamespace("privacy").Get("publicInventory"),
					togglePublicTradeHistory: remotes.Client.GetNamespace("settings")
						.GetNamespace("privacy")
						.Get("publicTradeHistory"),
					tradesEnabled: remotes.Client.GetNamespace('settings').GetNamespace("privacy").Get("tradesEnabled"),

					claimAccolade: remotes.Client.GetNamespace("accolades").Get("claimAccolade"),

					admin_SpawnPet: remotes.Client.GetNamespace("admin").Get("admin_SpawnPet"),
					admin_ModifyPetLevel: remotes.Client.GetNamespace("admin").Get("admin_ModifyPetLevel"),
					admin_ModifyWeaponLevel: remotes.Client.GetNamespace("admin").Get("admin_ModifyWeaponLevel"),
					admin_ModifyTalismanLevel: remotes.Client.GetNamespace("admin").Get("admin_ModifyTalismanLevel"),
					admin_ModifyRank: remotes.Client.GetNamespace("admin").Get("admin_ModifyRank"),
					admin_ModifyCurrency: remotes.Client.GetNamespace("admin").Get("admin_ModifyCurrency"),
					admin_ShutdownServer: remotes.Client.GetNamespace("admin").Get("admin_ShutdownServer"),
					admin_KickPlayer: remotes.Client.GetNamespace("admin").Get("admin_KickPlayer"),
					requestFusion: remotes.Client.Get("requestFusion"),

					requestTrading: remotes.Client.GetNamespace("trades").Get("requestTrade"),
					receiveTradeRequest: remotes.Client.GetNamespace("trades").Get("sendTradeRequest"),
					acceptTradeRequest: remotes.Client.GetNamespace("trades").Get("acceptTradeRequest"),
					declineTradeRequest: remotes.Client.GetNamespace("trades").Get("declineTradeRequest"),
					tradeRequestDeclined: remotes.Client.GetNamespace("trades").Get("tradeRequestDeclined"),
				}}
			>
				<AnnouncementAPI>
					<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} ResetOnSpawn={false}>
						{<App player={player} store={store} />}
					</screengui>
				</AnnouncementAPI>
			</remoteContext.Provider>,
			playerGui,
			"tree",
		);

		print(`Mounted Roact app in ${math.floor((os.clock() - start) * secondLength)}ms`);
	})
	.catch((e) => {
		throw `Failed to mount Roact app due to ${e}`;
	});
