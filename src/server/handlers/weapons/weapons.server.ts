debug.setmemorycategory("weaponsHandler");
import Object from "@rbxts/object-utils";
import { Players, ReplicatedStorage } from "@rbxts/services";
import { onStoreCreated } from "server/playerStore";
import { WEAPONS } from "shared/configs/weapons";
import { remotes } from "shared/remotes";
import { changeWeapon, equipWeapon, unequipWeapon } from "shared/rodux/currentWeapon";
import { getItemById } from "shared/util/getItemById";
import { setAssetProperties } from "shared/util/setAssetProperties";

import { withPlayerStore } from "../../modules/net/withPlayerStore";

remotes.Server.GetNamespace("weapons")
	.Get("changeWeapon")
	.Connect(
		withPlayerStore((_, store, weaponId) => {
			if (!store.getState().weapons.find((weapon) => weapon.id === weaponId)) {
				return;
			}

			const weaponData = Object.values(WEAPONS).find((weapon) => weapon.id === weaponId);
			if (weaponData === undefined) {
				return;
			}

			if (store.getState().rank < weaponData.cost.requiredRank) {
				return;
			}

			store.dispatch(changeWeapon(weaponId));
		}),
	);

remotes.Server.GetNamespace("weapons")
	.Get("equipWeapon")
	.Connect(
		withPlayerStore((_, store) => {
			const weaponData = Object.values(WEAPONS).find((weapon) => weapon.id === store.getState().currentWeapon.id);
			if (weaponData === undefined) {
				return;
			}

			if (store.getState().rank < weaponData.cost.requiredRank) {
				return;
			}

			store.dispatch(equipWeapon());
			return;
		}),
	);

remotes.Server.GetNamespace("weapons")
	.Get("unequipWeapon")
	.Connect(withPlayerStore((_, store) => store.dispatch(unequipWeapon())));

Players.PlayerAdded.Connect(async (player) => {
	const store = await onStoreCreated(player);

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
	}

	player.CharacterAdded.Connect(() => {
		// backpack is deleted each time the player spawns
		const backpack = player.FindFirstChildWhichIsA("Backpack");
		assert(backpack, `Failed to get backpack for ${player.Name}`);

		const weaponModel = getItemById(ReplicatedStorage.assetObjects.weapons, store.getState().currentWeapon.id);
		assert(weaponModel, `Failed to get weapon with id "${store.getState().currentWeapon}"`);

		// put into player backpack and starterGear
		const weapon = weaponModel.Clone();
		setAssetProperties("weapon", weapon as Tool);

		weapon.Parent = backpack;
	});

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

		// remove from character
		const oldWeapon = backpack.FindFirstChild(oldWeaponModel.Name) ?? characterWeapon;
		if (oldWeapon) {
			oldWeapon.Destroy();
		}

		// give player new weapon
		const newWeaponModel = getItemById(ReplicatedStorage.assetObjects.weapons, newState.currentWeapon.id);
		assert(newWeaponModel, `Failed to get weapon with id "${newState.currentWeapon}"`);

		const newWeapon = newWeaponModel.Clone();
		setAssetProperties("weapon", newWeapon as Tool);

		newWeapon.Parent = backpack;
	});
});
