import { Players, ReplicatedStorage } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { getItemById } from "shared/util/getItemById";

import { withPlayerStore } from "../modules/net/withPlayerStore";
import { equipWeapon } from "../modules/rodux/equipWeapon";
import { onStoreCreated } from "../playerStore";

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

	{
		const weaponModel = getItemById(ReplicatedStorage.weapons, store.getState().currentWeapon);
		if (!weaponModel) {
			throw `Failed to get weapon with id "${store.getState().currentWeapon}"`;
		}

		// put into player backpack and starterGear
		weaponModel.Clone().Parent = backpack;
		weaponModel.Clone().Parent = starterGear;
	}

	// listen to store weapon changes and apply them
	store.changed.connect((newState, oldState) => {
		if (newState.currentWeapon === oldState.currentWeapon) {
			return;
		}

		const oldWeaponModel = getItemById(ReplicatedStorage.weapons, oldState.currentWeapon);
		if (!oldWeaponModel) {
			throw `Failed to get weapon with id "${oldState.currentWeapon}"`;
		}

		// remove weapon model from player
		// first, remove the old weapon
		const characterWeapon = player.Character?.FindFirstChild(oldWeaponModel.Name);
		const wasEquipped = characterWeapon !== undefined;

		// remove from character
		const oldWeapon = backpack.FindFirstChild(oldWeaponModel.Name) ?? characterWeapon;
		if (oldWeapon) {
			oldWeapon.Parent = undefined;
		}

		// remove from StarterGear
		const starterGearWeapon = starterGear.FindFirstChild(oldWeaponModel.Name);
		if (starterGearWeapon) {
			starterGearWeapon.Parent = undefined;
		}

		// give player new weapon
		const newWeaponModel = getItemById(ReplicatedStorage.weapons, newState.currentWeapon);
		if (!newWeaponModel) {
			throw `Failed to get weapon with id "${newState.currentWeapon}"`;
		}
		newWeaponModel.Clone().Parent = wasEquipped ? player?.Character : backpack;
		newWeaponModel.Clone().Parent = starterGear;
	});
});
