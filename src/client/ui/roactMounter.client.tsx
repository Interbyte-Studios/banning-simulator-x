import Roact from "@rbxts/roact";
import { Players } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { remotes } from "shared/remotes";

import { app as App } from "./app";
import { remoteContext } from "./remoteContext";

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
					toggleAuto: remotes.Client.GetNamespace("eggs").Get("toggleAuto"),
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
