import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { remotes } from "shared/remotes";

import { app as App } from "./app";
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
					equipWeapon: remotes.Client.GetNamespace("weapons").Get("equipWeapon"),
					purchaseWeapon: remotes.Client.GetNamespace("weapons").Get("purchaseWeapon"),
					hatchEgg: remotes.Client.GetNamespace("eggs").Get("hatchEgg"),
					purchaseZone: remotes.Client.Get("purchaseZone"),
					redeemCode: remotes.Client.GetNamespace("media").Get("redeemCode"),
					redeemQuest: remotes.Client.Get("redeemQuest"),
					toggleButtonClickSFX: remotes.Client.GetNamespace("settings").GetNamespace("sound").Get("toggleButtonClick"),
					toggleMusicVolume: remotes.Client.GetNamespace("settings").GetNamespace("sound").Get("toggleMusicVolume"),
					toggleSoundEffectsVolume: remotes.Client.GetNamespace("settings")
						.GetNamespace("sound")
						.Get("toggleSoundEffectsVolume"),
					toggleAuto: remotes.Client.GetNamespace("settings").GetNamespace("gameplay").Get("toggleAuto"),
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
				}}
			>
				<screengui ZIndexBehavior={Enum.ZIndexBehavior.Sibling} ResetOnSpawn={false}>
					{<App player={player} store={store} />}
				</screengui>
			</remoteContext.Provider>,
			playerGui,
			"tree",
		);

		print(`Mounted Roact app in ${math.floor((os.clock() - start) * secondLength)}ms`);
	})
	.catch((e) => {
		throw `Failed to mount Roact app due to ${e}`;
	});
