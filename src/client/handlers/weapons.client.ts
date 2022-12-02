import { Players, ReplicatedStorage, StarterGui, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { NPCImpact, playSFX, WeaponSlash } from "client/util/playSound";
import { WeaponIndex, WEAPONS } from "shared/configs/weapons";
import Hitbox from "shared/modules/raycastModule";
import { remotes } from "shared/remotes";
import { isNpcCharacter } from "shared/remotes/damageNPC";
import { getItemById } from "shared/util/getItemById";

const player = Players.LocalPlayer;

// disable Roblox default backpack
StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

// get npcs folder
const npcsFolder = Workspace.WaitForChild("npcs") as Folder;

// cache connections
const connections: Array<RBXScriptConnection> = [];

/**
 * Handles equipping the player's weapon.
 *
 * @param weaponName The name of the weapon.
 * @param sfxVolume The volume of sound effects setting.
 */
function equipWeapon(weaponName: WeaponIndex, sfxVolume: number): void {
	// checks
	const character = player.Character;
	assert(character, `Failed to get Character for ${player.Name}`);

	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	assert(humanoid, `Failed to get Humanoid for ${player.Name}`);

	const backpack = player.FindFirstChildWhichIsA("Backpack");
	assert(backpack, `Failed to get backpack for ${player.Name}`);

	const weapon = backpack.FindFirstChild(weaponName);
	assert(weapon, `Failed to get weapon ${weaponName} for ${player.Name}`);
	assert(weapon.IsA("Tool"), `Weapon ${weaponName} for ${player.Name} is not a Tool`);

	const animator = humanoid.WaitForChild("Animator") as Animator;
	assert(animator, `Failed to get Animator for ${player.Name}`);

	const animateScript = character.FindFirstChild("Animate") as LocalScript;
	assert(animateScript, `Failed to get animate script for ${player.Name}`);

	const presetIdleAnimation = animateScript.FindFirstChild("idle") as StringValue;
	assert(presetIdleAnimation, `Failed to get preset idle animation for ${player.Name}`);

	// animations
	const weaponData = WEAPONS[weapon.Name as WeaponIndex];
	const animations = ReplicatedStorage.animations.weapons[weaponData.weaponType];

	let trail: Trail | undefined;
	for (const _trail of weapon.GetDescendants()) {
		if (!_trail.IsA("Trail")) {
			continue;
		}

		trail = _trail;
	}

	if (trail !== undefined) {
		trail.Enabled = false;
	}

	const defaultIdleAnimation = "http://www.roblox.com/asset/?id=507766388";

	const attackAnimation = animator.LoadAnimation(animations.Attack);
	const attack2Animation = animator.LoadAnimation(animations.Attack2);
	const attack3Animation = animator.LoadAnimation(animations.Attack3);

	const attackAnimations: Array<AnimationTrack> = [];
	attackAnimations.push(attackAnimation, attack2Animation, attack3Animation);

	const equipAnimation = animator.LoadAnimation(animations.Equip);

	const toolnone = animateScript.FindFirstChild("toolnone");
	if (toolnone) {
		toolnone.Destroy();
	}

	for (const animation of presetIdleAnimation.GetChildren()) {
		if (!animation.IsA("Animation")) {
			continue;
		}

		animation.AnimationId = animations.Idle.AnimationId;
	}

	// hitbox
	const raycastParams = new RaycastParams();
	raycastParams.FilterDescendantsInstances = [npcsFolder];
	raycastParams.FilterType = Enum.RaycastFilterType.Whitelist;

	const hitbox = new Hitbox(weapon);
	hitbox.RaycastParams = raycastParams;
	hitbox.Visualizer = false; // RunService.IsStudio();
	hitbox.Debuglog = false; // RunService.IsStudio();

	let loadedAllPoints = true;
	for (const hitboxAttachment of weapon.GetDescendants()) {
		if (!hitboxAttachment.IsA("Attachment")) {
			continue;
		}

		if (hitboxAttachment.Parent === undefined) {
			loadedAllPoints = false;
			warn("hitbox point parent undefiend");
			continue;
		}

		if (!hitboxAttachment.Parent.IsA("BasePart")) {
			warn("hitbox point not a basepart or bone");
			loadedAllPoints = false;
			continue;
		}

		hitbox.SetPoints(hitboxAttachment.Parent, [hitboxAttachment.Position]);
	}

	if (!loadedAllPoints) {
		warn(`Failed to load all points for weapon ${weapon.Name} for player ${player.Name}`);
	}

	// sounds
	const slashSounds = [
		{
			soundType: WeaponSlash.Slash1,
			played: false,
		},
		{
			soundType: WeaponSlash.Slash2,
			played: false,
		},
		{
			soundType: WeaponSlash.Slash3,
			played: false,
		},
	];

	// connections
	const weaponEquipped = weapon.Equipped.Connect(() => equipAnimation.Play());
	connections.push(weaponEquipped);

	let canSwing = true;
	const weaponActivation = weapon.Activated.Connect(() => {
		if (canSwing === false) {
			return;
		}

		const playingAnimations = attackAnimations.filter((animation) => animation.IsPlaying === true);
		if (playingAnimations.size() > 0) {
			return;
		}

		if (trail !== undefined) {
			trail.Enabled = true;
		}

		canSwing = false;

		const randomNumber = math.ceil(math.random(1, attackAnimations.size())) - 1;
		const animationToPlay = attackAnimations[randomNumber];

		hitbox.HitStart();

		const slashSoundsGroup = slashSounds.filter((metaData) => metaData.played === true);
		if (slashSoundsGroup.size() === slashSounds.size()) {
			slashSounds.forEach((metaData) => {
				metaData.played = false;
			});
		}

		const slashSound = slashSounds.filter((metaData) => metaData.played === false);
		if (slashSound[0] !== undefined) {
			slashSound[0].played = true;
			playSFX(slashSound[0].soundType, sfxVolume);
		} else {
			warn(`Failed to load and play weapon activation sound.`);
		}

		animationToPlay.Play();
		animationToPlay.Stopped.Wait();

		if (hitbox.HitStop !== undefined) {
			hitbox.HitStop();
		}

		canSwing = true;

		if (trail !== undefined) {
			trail.Enabled = false;
		}
	});
	connections.push(weaponActivation);

	const weaponUnequipped = weapon.Unequipped.Connect(() => {
		for (const animation of presetIdleAnimation.GetChildren()) {
			if (!animation.IsA("Animation")) {
				continue;
			}

			animation.AnimationId = defaultIdleAnimation;
		}
	});
	connections.push(weaponUnequipped);

	const hitBox = hitbox.OnHit.Connect((_, humanoid) => {
		const npcCharacter = humanoid.Parent;
		if (npcCharacter === undefined) {
			return;
		}

		if (!isNpcCharacter(npcCharacter)) {
			return;
		}

		playSFX(NPCImpact.NPCImpact1, sfxVolume);
		remotes.Client.Get("damageNPC").SendToServer(npcCharacter);
	});
	connections.push(hitBox);

	// equip the tool
	humanoid.UnequipTools();
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

			const character = player.Character;
			assert(character, `Failed to get Character for ${player.Name}`);

			if (!currentState.currentWeapon.equipped) {
				const humanoid = character.FindFirstChildOfClass("Humanoid");
				assert(humanoid, `Failed to get Humanoid for ${player.Name}`);

				humanoid.UnequipTools();
			}

			const weaponsFolder = ReplicatedStorage.assetObjects.weapons;

			const weapon = getItemById(weaponsFolder, currentState.currentWeapon.id);
			assert(weapon, `Failed to get weapon data for ${currentState.currentWeapon.id}`);

			const currentlyEquippedTool = character.FindFirstChildOfClass("Tool");
			if (currentlyEquippedTool !== undefined && currentlyEquippedTool.Name === weapon.Name) {
				return;
			}

			for (const connection of connections) {
				const connectionIndex = connections.findIndex((x) => x === connection);
				if (connectionIndex !== undefined) {
					connection.Disconnect();
					connections.unorderedRemove(connectionIndex);
				}
			}

			equipWeapon(weapon.Name as WeaponIndex, store.getState().settings.sound.soundEffects);
		}

		if (player.Character) {
			checkToEquipWeapon();
		}

		store.changed.connect((newState, oldState) => {
			if (newState.currentWeapon === oldState.currentWeapon) {
				return;
			}

			if (!newState.currentWeapon.equipped) {
				const character = player.Character;
				assert(character, `Failed to get Character for ${player.Name}`);

				const humanoid = character.FindFirstChildOfClass("Humanoid");
				assert(humanoid, `Failed to get Humanoid for ${player.Name}`);

				humanoid.UnequipTools();
			} else {
				checkToEquipWeapon();
			}
		});
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
