import { Players, RunService, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { cachePetForAnimation } from "client/modules/pets/createPetFollow";
import {
	createPetAnimationCache,
	getPetAnimationCache,
	PlayerAnimationCache,
	removePetAnimationCache,
} from "client/modules/pets/petAnimationCache";
import { removePet } from "client/modules/pets/unequipPet";
import { Pet } from "shared/rodux/pets";
import { ValidPetAnimationType } from "shared/rodux/settings";

const radius = math.pi * 2;

/**
 *
 * @param angle The angle where the pet gets its position.
 * @param totalPets The amount of pets the player equipped.
 * @param settingsDistance The amount of distance manually added by the player.
 * @returns The positions for the pets around the player.
 */
function getXandZ(angle: number, totalPets: number, settingsDistance: number): { xPos: number; zPos: number } {
	const petsForAngle = totalPets + 0.5 + settingsDistance / 3;
	const xPos = math.cos(angle) * petsForAngle;
	const zPos = math.sin(angle) * petsForAngle;

	return { xPos, zPos };
}

/**
 * Returns whether the value is NaN.
 *
 * @param value The value to check.
 * @returns Whether the value is NaN.
 * @example isNaN(0/0) -> true
 */
function isNan(value: number): boolean {
	return value !== value;
}

/**
 * Updates the player's animation cache with new visual settings.
 *
 * @param playerCache The cache of the player.
 * @param visualSettings The visual settings of the player.
 * @param visualSettings.petsDisplayed Whether or not pets are displayed.
 * @param visualSettings.petsStudsOfDistance The amount of studs the pets are away from the player.
 * @param visualSettings.petAnimationType The animation type of the pets.
 */
const updatePlayerCacheVisuals = (
	playerCache: PlayerAnimationCache,
	visualSettings: { petsDisplayed: boolean; petsStudsOfDistance: number; petAnimationType: ValidPetAnimationType },
): void => {
	playerCache.petsDisplayed.Value = visualSettings.petsDisplayed;
	playerCache.distance.Value = visualSettings.petsStudsOfDistance;
	playerCache.animationType.Value = visualSettings.petAnimationType;
};

/**
 * Creates and caches a pet for the player.
 *
 * @param player The player to create and cache the pet for.
 * @param playerCache The cache of the player.
 * @param pet The pet to create and cache.
 */
const createAndCachePet = (player: Player, playerCache: PlayerAnimationCache, pet: Pet): void => {
	const createdPet = cachePetForAnimation(player, pet.id, pet.guid, pet.variant);
	if (createdPet === undefined) {
		return;
	}

	createdPet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
	playerCache.pets.push(createdPet);
};

/**
 * Caches the pet animation for a player.
 *
 * @param player The player to cache the pet animation for.
 * @returns A callback that yields until the player's store has been created.
 */
const cachePlayerPetanimation = (player: Player): Promise<void> =>
	onStoreCreated(player)
		.andThen((store) => {
			debug.setmemorycategory("cachePlayerPetAnimation");
			task.spawn(() =>
				task.delay(5, () => {
					const currentState = store.getState();
					const playerCache = createPetAnimationCache(player);
					updatePlayerCacheVisuals(playerCache, currentState.settings.visual);

					currentState.pets.forEach((pet) => {
						if (pet.equipped) {
							createAndCachePet(player, playerCache, pet);
						}
					});

					store.changed.connect((newState, oldState) => {
						if (newState.settings.visual !== oldState.settings.visual) {
							updatePlayerCacheVisuals(playerCache, newState.settings.visual);
						}

						if (newState.pets !== oldState.pets) {
							newState.pets.forEach((pet) => {
								if (pet.equipped) {
									const cachedPetIndex = playerCache.pets.find((animatedPet) => animatedPet.guid === pet.guid);
									if (cachedPetIndex === undefined) {
										createAndCachePet(player, playerCache, pet);
									}
								} else {
									const cachedPetIndex = playerCache.pets.findIndex((animatedPet) => animatedPet.guid === pet.guid);
									if (cachedPetIndex !== -1) {
										playerCache.pets.unorderedRemove(cachedPetIndex);
										removePet(pet.guid);
									}
								}
							});
						}
					});

					if (player.UserId !== Players.LocalPlayer.UserId) {
						for (const pet of playerCache.pets) {
							pet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
						}
						return;
					}

					const currentCacheState = getPetAnimationCache();
					for (const _playerCache of currentCacheState) {
						for (const pet of _playerCache.pets) {
							pet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
						}
					}

					playerCache.petsDisplayed.GetPropertyChangedSignal("Value").Connect(() => {
						if (player.UserId !== Players.LocalPlayer.UserId) {
							for (const pet of playerCache.pets) {
								pet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
							}
							return;
						}

						const currentCacheState = getPetAnimationCache();
						for (const _playerCache of currentCacheState) {
							for (const pet of _playerCache.pets) {
								pet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
							}
						}
					});
				}),
			);
		})
		.catch((e) => {
			throw `[ Pet Follow Handler ] - Failed to run promise callback on "onStoreCreated" for ${player.Name} | ${e}`;
		});

Players.GetPlayers().forEach((player) => task.delay(2, () => cachePlayerPetanimation(player)));
Players.PlayerAdded.Connect((player) => task.delay(2, () => cachePlayerPetanimation(player)));
Players.PlayerRemoving.Connect((player) => task.delay(2, () => removePetAnimationCache(player)));

const rayCastParams = new RaycastParams();
rayCastParams.IgnoreWater = true;
rayCastParams.FilterType = Enum.RaycastFilterType.Exclude;
rayCastParams.FilterDescendantsInstances = [Workspace.worlds];

/**
 * Calculates the shared data for all pets.
 *
 * @param now The current time.
 * @returns The shared data for all pets.
 */
const calculateSharedData = (
	now: number,
): { petJump: number; petRotate: number; petHover: number; petFace: number } => {
	const petJump = math.clamp(math.cos(now * 24) * 2, 0, 2);
	const petRotate = math.cos(now * 10) * 30;
	const petHover = math.cos(now * 2.5) * 1.2;
	const petFace = math.sin(now * 2.2) * 15;

	return { petJump, petRotate, petHover, petFace };
};

RunService.RenderStepped.Connect(() => {
	debug.setmemorycategory("petFollow");
	debug.profilebegin("petFollow");
	const now = time();
	const { petJump, petRotate, petHover, petFace } = calculateSharedData(now);
	const currentCacheState = getPetAnimationCache();
	for (const playerCache of currentCacheState) {
		// make sure we have the necessary objects to animate the pets
		const character = playerCache.player.Character;
		if (character === undefined) {
			continue;
		}

		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (humanoid === undefined) {
			continue;
		}

		const humanoidRootPart = humanoid.RootPart;
		if (humanoidRootPart === undefined) {
			continue;
		}

		// we use raycasts for walking pets to make sure they're animated right above the ground
		rayCastParams.FilterDescendantsInstances = [Workspace.worlds, character];

		// iterate through all the pets the player has equipped and animate them
		playerCache.pets.forEach((pet, index) => {
			// let's be sure the pet model exists in the workspace, to prevent unintentional behavior
			if (pet.model.Parent === undefined) {
				return;
			}

			// we use the primary part of the pet model for manipulating it's position and orientation
			const primaryPart = pet.model.PrimaryPart;
			if (primaryPart === undefined) {
				return;
			}

			// align position is how we keep the pet in a relative distance to the player
			const alignPosition = pet.alignPosition;

			// for flying pets, we need Rigidity enabled to prevent unexpected reactions to roblox physics
			if (pet.petType === "Fly" && !alignPosition.RigidityEnabled) {
				alignPosition.RigidityEnabled = true;
			}

			// align orientation is how we keep the pet either facing the player, or facing the direction the player is moving
			const alignOrientation = pet.alignOrientation;

			// make sure pet is within 100 studs of player at all times
			const magnitudeFromPlayer = humanoidRootPart.Position.sub(primaryPart.Position).Magnitude;
			if (magnitudeFromPlayer > 100) {
				pet.model.PivotTo(humanoidRootPart.CFrame);
				return;
			}

			// if the pet's magnitude is 0, then the pet is not moving, which is when we'd play the idle animation
			const isMoving = humanoid.MoveDirection.Magnitude > 0;

			// here's where we get the bounding box of the pet model and calculate its jump and rotation values
			const [, petSize] = pet.model.GetBoundingBox();

			// animate the pets based on whether they player has their animation set to "Surrounding" or "Following"
			if (playerCache.animationType.Value === "Surrounding") {
				// calculate the position of the pet in the surrounding (circle) animation
				const equippedPets = playerCache.pets.size();
				const petAngle = index * (radius / equippedPets);
				const { xPos, zPos } = getXandZ(petAngle, equippedPets, playerCache.distance.Value);

				if (isNan(xPos) || isNan(zPos)) {
					pet.model.PivotTo(humanoidRootPart.CFrame);
				}

				// some pets walk, some fly
				if (pet.petType === "Walk") {
					// we need to make sure the pet is above the ground, so we use a raycast to get the position of the ground
					const magicVector = new Vector3(xPos, 20, zPos);
					const originPosition = humanoidRootPart.Position.add(magicVector);
					const directionOfRaycast = new Vector3(0, -100, 0);

					const rayCast = Workspace.Raycast(originPosition, directionOfRaycast, rayCastParams);
					if (rayCast === undefined) {
						return;
					}

					// gotta make sure the pet's being animated over a floor or hard surface (If the object can't collide with other objects, don't animate it over that object)
					if (rayCast.Instance.CanCollide === false) {
						return;
					}

					// i'm honestly not sure why these magic numbers are here but hey, it is, and it works!
					const boundingBoxMultiplier_Y = isMoving ? 2 : 1.1;

					// we only animate the jump if the player is moving, otherwise when the player jumps the pets will stay on the ground
					const jumpingFactor = isMoving ? petJump : 0;

					// here we account for the pet needing to be right above the ground (to simulate walking), and it's jump value for when the player jumps
					const aboveGroundY = rayCast.Position.Y + petSize.Y / (petSize.Y * boundingBoxMultiplier_Y);
					if (isNan(aboveGroundY)) {
						pet.model.PivotTo(humanoidRootPart.CFrame);
					}

					const aboveGroundCFrame = new CFrame(humanoidRootPart.CFrame.X, aboveGroundY, humanoidRootPart.CFrame.Z);
					const jumpCFrame = new CFrame(xPos, jumpingFactor, zPos);
					const petCFrame = aboveGroundCFrame.mul(jumpCFrame);

					if (isNan(petCFrame.X) || isNan(petCFrame.Y) || isNan(petCFrame.Z)) {
						pet.model.PivotTo(humanoidRootPart.CFrame);
					}

					// when the player is moving, we want the pet to face the direction the player is moving, otherwise we want the pet to face the player
					const orientedInPlayerDirection = humanoidRootPart.CFrame.mul(CFrame.Angles(math.rad(petRotate), 0, 0));
					const lookingAtPlayer = CFrame.lookAt(primaryPart.Position, humanoidRootPart.Position);

					if (
						isNan(orientedInPlayerDirection.X) ||
						isNan(orientedInPlayerDirection.Y) ||
						isNan(orientedInPlayerDirection.Z) ||
						isNan(lookingAtPlayer.X) ||
						isNan(lookingAtPlayer.Y) ||
						isNan(lookingAtPlayer.Z)
					) {
						pet.model.PivotTo(humanoidRootPart.CFrame);
						return;
					}

					const petRotationCFrame = isMoving ? orientedInPlayerDirection : lookingAtPlayer;

					// animate!
					alignPosition.Position = petCFrame.Position;
					alignOrientation.CFrame = petRotationCFrame;

					// set the secondary axis of the pet for some reason (idk)
					if (!isMoving) {
						alignOrientation.SecondaryAxis = new Vector3(0, 1, 0);
					}
				} else if (pet.petType === "Fly") {
					// calculate the align position of the pet with respect to the player
					const petCFrame = new CFrame(
						humanoidRootPart.CFrame.X,
						humanoidRootPart.Position.Y,
						humanoidRootPart.CFrame.Z,
					);

					// calculate the position of the pet, with respect to it's flying animation
					const petFlying = new CFrame(xPos, petHover, zPos);

					// multiply the pet's position with it's flying animation
					const petCFrameWithFlying = petCFrame.mul(petFlying);

					// calculate the pets orientation based on whether it is moving or not (same as walking pets)
					const petOrientation = isMoving
						? humanoidRootPart.CFrame.mul(CFrame.Angles(math.rad(petFace), 0, 0))
						: CFrame.lookAt(primaryPart.Position, humanoidRootPart.Position).mul(
								CFrame.Angles(math.rad(petFace), 0, 0),
						  );

					// animate!
					alignPosition.Position = petCFrameWithFlying.Position;
					alignOrientation.CFrame = petOrientation;
				}
			} else if (playerCache.animationType.Value === "Following") {
				// calculate the colum pet is sorted into based on how many pets are equipped
				const spacing = 2.5;
				const columns = math.floor(math.sqrt(playerCache.pets.size()));
				const offset = new Vector3((-columns / 1.5) * spacing + spacing / 2, 0, 4);

				// calculate the x and z positions of the pet!
				const xCoord = (index % columns) * spacing;
				const zCoord = math.floor(index / columns);

				// some pets walk, some fly
				if (pet.petType === "Walk") {
					const magicY = 20;
					const originPosition = new Vector3(0, magicY, 0);
					const raycastDirection = new Vector3(0, -100, 0);

					const rayCast = Workspace.Raycast(originPosition, raycastDirection, rayCastParams);
					if (rayCast === undefined) {
						return;
					}

					const boundingBoxMultiplier_Y = isMoving ? 2 : 1.1;
					const jumpingFactor = isMoving ? petJump : 0;

					const aboveGroundPos_Y = rayCast.Position.Y + petSize.Y / (petSize.Y * boundingBoxMultiplier_Y);
					const aboveGroundCFrame = new CFrame(humanoidRootPart.CFrame.Y, aboveGroundPos_Y, humanoidRootPart.CFrame.Z);

					const humanoidRotation = humanoidRootPart.CFrame.Rotation;
					const petRotation = new CFrame(offset.add(new Vector3(xCoord, jumpingFactor, zCoord).mul(spacing)));

					const petOrientation = humanoidRootPart.CFrame;
					const petCFrame = aboveGroundCFrame.mul(humanoidRotation).mul(petRotation);

					alignPosition.Position = petCFrame.Position;
					alignOrientation.CFrame = petOrientation;

					if (!isMoving) {
						alignOrientation.SecondaryAxis = new Vector3(0, 1, 0);
					}
				} else if (pet.petType === "Fly") {
					const petCFrame = new CFrame(
						humanoidRootPart.CFrame.X,
						humanoidRootPart.Position.Y,
						humanoidRootPart.CFrame.Z,
					);
					const humanoidRotation = humanoidRootPart.CFrame.Rotation;
					const petRotation = new CFrame(
						offset.add(new Vector3(xCoord, math.clamp(petHover, -0.5, 0.5), zCoord).mul(spacing)),
					);

					const petOrientation = humanoidRootPart.CFrame.mul(CFrame.Angles(math.rad(petFace), 0, 0));

					alignPosition.Position = petCFrame.mul(humanoidRotation).mul(petRotation).Position;
					alignOrientation.CFrame = petOrientation;
				}
			}
		});
	}
	debug.profileend();
});
