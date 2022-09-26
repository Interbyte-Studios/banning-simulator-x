import { Players, ReplicatedStorage } from "@rbxts/services";
import { remotes } from "shared/remotes";
import { changeWeapon, equipWeapon, unequipWeapon } from "shared/rodux/currentWeapon";
import { getItemById } from "shared/util/getItemById";
import { setAssetProperties } from "shared/util/setAssetProperties";

import { withPlayerStore } from "../../modules/net/withPlayerStore";
import { onStoreCreated } from "../../playerStore";

remotes.Server.GetNamespace("weapons")
	.Create("changeWeapon")
	.Connect(
		withPlayerStore((_, store, weaponId) => {
			if (!store.getState().weapons.find((weapon) => weapon.id === weaponId)) {
				return;
			}

			store.dispatch(changeWeapon(weaponId));
		}),
	);

remotes.Server.GetNamespace("weapons")
	.Create("equipWeapon")
	.Connect(withPlayerStore((_, store) => store.dispatch(equipWeapon())));

remotes.Server.GetNamespace("weapons")
	.Create("unequipWeapon")
	.Connect(withPlayerStore((_, store) => store.dispatch(unequipWeapon())));

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

	// create weapon tools
	const starterGear = player.FindFirstChildWhichIsA("StarterGear");
	assert(starterGear, `Failed to get StarterGear for ${player.Name}`);

	{
		// backpack is deleted each time the player spawns
		const backpack = player.FindFirstChildWhichIsA("Backpack");
		assert(backpack, `Failed to get backpack for ${player.Name}`);

		const weaponModel = getItemById(ReplicatedStorage.assetObjects.weapons, store.getState().currentWeapon.id);
		assert(weaponModel, `Failed to get weapon with id "${store.getState().currentWeapon}"`);

		// put into player backpack and starterGear
		const weapon = weaponModel.Clone();
		setAssetProperties("weapon", weapon as Tool);

		weapon.Parent = backpack;
		weapon.Clone().Parent = starterGear;
	}

	// listen to store weapon changes and apply them
	store.changed.connect((newState, oldState) => {
		const backpack = player.FindFirstChildWhichIsA("Backpack");
		assert(backpack, `Failed to get backpack for ${player.Name}`);

		if (newState.currentWeapon === oldState.currentWeapon) {
			return;
		}

		const oldWeaponModel = getItemById(ReplicatedStorage.assetObjects.weapons, oldState.currentWeapon.id);
		assert(oldWeaponModel, `Failed to get weapon with id "${oldState.currentWeapon}"`);

		// remove weapon model from player
		// first, remove the old weapon
		const characterWeapon = player.Character?.FindFirstChild(oldWeaponModel.Name);
		const wasEquipped = characterWeapon !== undefined;

		// remove from character
		const oldWeapon = backpack.FindFirstChild(oldWeaponModel.Name) ?? characterWeapon;
		assert(oldWeapon, `Failed to get old weapon "${oldWeaponModel.Name}" from player`);
		oldWeapon.Parent = undefined;

		// remove from StarterGear
		const starterGearWeapon = starterGear.FindFirstChild(oldWeaponModel.Name);
		if (starterGearWeapon) {
			starterGearWeapon.Parent = undefined;
		}

		// give player new weapon
		const newWeaponModel = getItemById(ReplicatedStorage.assetObjects.weapons, newState.currentWeapon.id);
		assert(newWeaponModel, `Failed to get weapon with id "${newState.currentWeapon}"`);

		const newWeapon = newWeaponModel.Clone();
		setAssetProperties("weapon", newWeapon as Tool);

		newWeapon.Parent = wasEquipped ? player.Character : backpack;
		newWeapon.Clone().Parent = starterGear;
	});
});
