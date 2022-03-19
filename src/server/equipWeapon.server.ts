import { Players, ReplicatedStorage } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { getItemById } from "shared/util/getItemById";

import { withPlayerStore } from "./modules/net/withPlayerStore";
import { equipWeapon } from "./modules/rodux/equipWeapon";
import { onStoreCreated } from "./playerStore";

remotes.Server.Create("equipWeapon").Connect(withPlayerStore((_, store, weaponId) => equipWeapon(store, weaponId)));

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	// create weapon tools
	const backpack = player.FindFirstChildWhichIsA("Backpack");
	const starterGear = player.FindFirstChildWhichIsA("StarterGear");
	if (!backpack) {
		throw `Failed to get backpack for ${player.Name}`;
	}
	if (!starterGear) {
		throw `Failed to get StarterGear for ${player.Name}`;
	}

	const weaponModel = getItemById(ReplicatedStorage.weapons, store.getState().currentWeapon);
	if (!weaponModel) {
		throw `Failed to get weapon with id "${store.getState().currentWeapon}"`;
	}

	// put into player backpack and starterGear
	weaponModel.Clone().Parent = backpack;
	weaponModel.Clone().Parent = starterGear;
});
