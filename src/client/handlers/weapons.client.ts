import { Players, ReplicatedStorage, StarterGui } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { WeaponIndex, WEAPONS } from "shared/configs/weapons";
import { getItemById } from "shared/util/getItemById";

const player = Players.LocalPlayer;

// disable Roblox default backpack
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

/**
 * Handles equipping the player's weapon.
 *
 * @param weaponName The name of the weapon.
 */
function equipWeapon(weaponName: WeaponIndex): void {
	const backpack = player.FindFirstChildWhichIsA("Backpack");
	assert(backpack, `Failed to get backpack for ${player.Name}`);

	const weapon = backpack.FindFirstChild(weaponName);
	assert(weapon, `Failed to get weapon ${weaponName} for ${player.Name}`);
	assert(weapon.IsA("Tool"), `Weapon ${weaponName} for ${player.Name} is not a Tool`);

	const character = player.Character;
	assert(character, `Failed to get Character for ${player.Name}`);

	const humanoid = character.FindFirstChildOfClass("Humanoid");
	assert(humanoid, `Failed to get Humanoid for ${player.Name}`);

	const animator = humanoid.FindFirstChildOfClass("Animator");
	assert(animator, `Failed to get Animator for ${player.Name}`);

	const animateScript = character.FindFirstChild("Animate") as LocalScript;
	assert(animateScript, `Failed to get animate script for ${player.Name}`);

	const presetIdleAnimation = animateScript.FindFirstChild("idle") as StringValue;
	assert(presetIdleAnimation, `Failed to get preset idle animation for ${player.Name}`);

	const defaultIdleAnimation = "http://www.roblox.com/asset/?id=507766388";

	const weaponData = WEAPONS[weaponName];
	const animations = ReplicatedStorage.animations.weapons[weaponData.weaponType];

	const attackAnimation = animator.LoadAnimation(animations.Attack);
	const equipAnimation = animator.LoadAnimation(animations.Equip);

	for (const animation of presetIdleAnimation.GetChildren()) {
		if (!animation.IsA("Animation")) {
			continue;
		}

		animation.AnimationId = animations.Idle.AnimationId;
	}

	weapon.Equipped.Connect(() => equipAnimation.Play());

	let canSwing = true;
	weapon.Activated.Connect(() => {
		if (canSwing === false) {
			return;
		}

		canSwing = false;

		attackAnimation.Play();
		attackAnimation.Stopped.Wait();

		canSwing = true;
	});

	weapon.Unequipped.Connect(() => {
		for (const animation of presetIdleAnimation.GetChildren()) {
			if (!animation.IsA("Animation")) {
				continue;
			}

			animation.AnimationId = defaultIdleAnimation;
		}
	});

	humanoid.EquipTool(weapon);
}

onStoreCreated(player)
	.andThen((store) => {
		const backpack = player.FindFirstChildWhichIsA("Backpack");
		assert(backpack, `Failed to get backpack for ${player.Name}`);

		/**
		 * Checks to see if the player's current weapon should be equipped or not.
		 */
		function checkToEquipWeapon(): void {
			const currentState = store.getState();
			if (currentState.currentWeapon.equipped) {
				const weaponsFolder = ReplicatedStorage.assetObjects.weapons;

				const weapon = getItemById(weaponsFolder, currentState.currentWeapon.id);
				assert(weapon, `Failed to get weapon data for ${currentState.currentWeapon.id}`);

				equipWeapon(weapon.Name as WeaponIndex);
			}
		}

		checkToEquipWeapon();

		player.CharacterAppearanceLoaded.Connect(() => {
			checkToEquipWeapon();
		});

		backpack.ChildAdded.Connect(() => {
			checkToEquipWeapon();
		});

		store.changed.connect((newState, oldState) => {
			if (newState.currentWeapon === oldState.currentWeapon) {
				return;
			}

			if (newState.currentWeapon.equipped && newState.currentWeapon.equipped !== oldState.currentWeapon.equipped) {
				checkToEquipWeapon();
			}

			if (!newState.currentWeapon.equipped && newState.currentWeapon.equipped !== oldState.currentWeapon.equipped) {
				const character = player.Character;
				assert(character, `Failed to get Character for ${player.Name}`);

				const humanoid = character.FindFirstChildOfClass("Humanoid");
				assert(humanoid, `Failed to get Humanoid for ${player.Name}`);

				humanoid.UnequipTools();
			}
		});
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
