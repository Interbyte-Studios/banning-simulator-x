import { Players, RunService, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { cachePetForAnimation } from "client/modules/pets/createPetFollow";
import {
	createPetAnimationCache,
	getPetAnimationCache,
	removePetAnimationCache,
} from "client/modules/pets/petAnimationCache";
import { removePet } from "client/modules/pets/unequipPet";
import { isValidPetAnimationType } from "shared/rodux/settings";

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
 * Caches a player's settings and animates their pets physical models..
 *
 * @param player The player object.
 * @returns An empty promise.
 */
const cachePlayerPetanimation = (player: Player): Promise<void> =>
	onStoreCreated(player)
		.andThen((store) => {
			const initialState = store.getState();

			const character = player.Character ?? player.CharacterAdded.Wait()[0];
			if (character === undefined) {
				warn(`Character could not be defined for ${player.Name}, therefore pets could not be animated.`);
				return;
			}

			const humanoid = character.WaitForChild("Humanoid") as Humanoid;
			if (humanoid === undefined) {
				warn(`Humanoid could not be defined for ${player.Name}, therefore pets could not be animated.`);
				return;
			}

			const humanoidRootPart = humanoid.RootPart;
			if (humanoidRootPart === undefined) {
				warn(`HumanoidRootPart could not be defined for ${player.Name}, therefore pets could not be animated.`);
				return;
			}

			const playerCache = createPetAnimationCache(player);

			playerCache.petsDisplayed.Value = initialState.settings.visual.petsDisplayed;
			playerCache.distance.Value = initialState.settings.visual.petsStudsOfDistance;
			playerCache.animationType.Value = initialState.settings.visual.petAnimationType;

			initialState.pets.forEach((pet) => {
				if (!pet.equipped) {
					return;
				}

				const createdPet = cachePetForAnimation(player, pet.id, pet.guid, pet.variant);
				createdPet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
				createdPet.model.PivotTo(humanoidRootPart.CFrame);

				playerCache.pets.push(createdPet);
			});

			store.changed.connect((newState, oldState) => {
				if (newState.settings.visual !== oldState.settings.visual) {
					playerCache.petsDisplayed.Value = newState.settings.visual.petsDisplayed;
					playerCache.distance.Value = newState.settings.visual.petsStudsOfDistance;
					playerCache.animationType.Value = newState.settings.visual.petAnimationType;
				}

				if (newState.pets === oldState.pets) {
					return;
				}

				const character = player.Character ?? player.CharacterAdded.Wait()[0];
				if (character === undefined) {
					warn(`Character could not be defined for ${player.Name}, therefore pets could not be animated.`);
					return;
				}

				const humanoid = character.WaitForChild("Humanoid") as Humanoid;
				if (humanoid === undefined) {
					warn(`Humanoid could not be defined for ${player.Name}, therefore pets could not be animated.`);
					return;
				}

				const humanoidRootPart = humanoid.RootPart;
				if (humanoidRootPart === undefined) {
					warn(`HumanoidRootPart could not be defined for ${player.Name}, therefore pets could not be animated.`);
					return;
				}

				newState.pets.forEach((pet) => {
					if (pet.equipped) {
						const cachedPetIndex = playerCache.pets.find((animatedPet) => animatedPet.guid === pet.guid);
						if (cachedPetIndex !== undefined) {
							return warn(`It's already cached, but attempted to add it!`);
						}

						const createdPet = cachePetForAnimation(player, pet.id, pet.guid, pet.variant);
						createdPet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
						playerCache.pets.push(createdPet);
						warn(`Added pet ${pet.id} to ${player.Name}'s pet animation cache.`);

						return;
					}

					const cachedPetIndex = playerCache.pets.findIndex((animatedPet) => animatedPet.guid === pet.guid);
					if (cachedPetIndex === undefined) {
						return warn(`It's not cached, but attempted to remove it!`);
					}

					playerCache.pets.unorderedRemove(cachedPetIndex);
					removePet(pet.guid);
					warn(`Removed pet ${pet.id} from ${player.Name}'s pet animation cache.`);
				});
			});

			const currentCacheState = getPetAnimationCache();
			currentCacheState.forEach((playerCache) =>
				playerCache.pets.forEach((cachedPet) => {
					cachedPet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
				}),
			);

			playerCache.petsDisplayed.GetPropertyChangedSignal("Value").Connect(() => {
				const currentCacheState = getPetAnimationCache();
				currentCacheState.forEach((playerCache) =>
					playerCache.pets.forEach((cachedPet) => {
						cachedPet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
					}),
				);
			});
		})
		.catch((e) => {
			throw `Failed to get store for player ${player.Name} | ${e}`;
		});

Players.GetPlayers().forEach((player) => cachePlayerPetanimation(player));
Players.PlayerAdded.Connect((player) => cachePlayerPetanimation(player));
Players.PlayerRemoving.Connect((player) => removePetAnimationCache(player));

let lastPrint = 0;
const debugEnabled = false; // RunService.IsStudio();
RunService.RenderStepped.Connect(() => {
	// get the players currently equipped pet models
	const currentCacheState = getPetAnimationCache();

	// iterate through all the players in the game, and animate their pets
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
		const rayCastParams = new RaycastParams();
		rayCastParams.IgnoreWater = true;
		rayCastParams.FilterType = Enum.RaycastFilterType.Exclude;
		rayCastParams.FilterDescendantsInstances = [character, Workspace.worlds];

		// iterate through all the pets the player has equipped and animate them
		playerCache.pets.forEach((pet, index) => {
			// let's be sure the pet model exists in the workspace, to prevent unintentional behavior
			if (pet.model.Parent === undefined) {
				return;
			}

			// type checking is important! We need to be sure the pet has either "flying" or "walking" as its animation type
			const animationType = playerCache.animationType.Value;
			if (!isValidPetAnimationType(animationType)) {
				return;
			}

			// we use the primary part of the pet model for manipulating it's position and orientation
			const petType = pet.petType;
			const petModel = pet.model;
			const primaryPart = petModel.PrimaryPart;
			if (primaryPart === undefined) {
				return;
			}

			// we need to log the time for certain aspects of the animation such as cosine functions, since they oscilate
			const now = time();

			// align position is how we keep the pet in a relative distance to the player
			const alignPosition = pet.alignPosition;

			// align orientation is how we keep the pet either facing the player, or facing the direction the player is moving
			const alignOrientation = pet.alignOrientation;

			// make sure pet is within 25 studs of player at all times
			const magnitudeFromPlayer = humanoidRootPart.Position.sub(primaryPart.Position).Magnitude;
			if (magnitudeFromPlayer > 25) {
				petModel.PivotTo(humanoidRootPart.CFrame);
				if (now - lastPrint > 3 && debugEnabled) {
					warn(
						"[STUDIO DEBUG] Pet model was too far from player, resetting position | Magnitude was " +
							magnitudeFromPlayer,
					);
					lastPrint = now;
				}
				return;
			}

			// if the pet's magnitude is 0, then the pet is not moving, which is when we'd play the idle animation
			const isMoving = humanoid.MoveDirection.Magnitude > 0;

			// here's where we get the bounding box of the pet model and calculate its jump and rotation values
			const [, petSize] = petModel.GetBoundingBox();
			const petJump = math.clamp(math.cos(now * 24) * 2, 0, 2);
			const petRotate = math.cos(now * 10) * 30;

			// calculate the hover and face values for the pet model
			const petHover = math.cos(now * 2.5) * 1.2;
			const petFace = math.sin(now * 2.2) * 15;

			// animate the pets based on whether they player has their animation set to "Surrounding" or "Following"
			if (animationType === "Surrounding") {
				// calculate the position of the pet in the surrounding (circle) animation
				const equippedPets = playerCache.pets.size();
				const petAngle = index * (radius / equippedPets);
				const { xPos, zPos } = getXandZ(petAngle, equippedPets, playerCache.distance.Value);

				if (isNan(xPos) || isNan(zPos)) {
					if (debugEnabled && now - lastPrint > 3) {
						warn(`[STUDIO DEBUG] X or Z position is NaN for ${petModel.Name}`);
						lastPrint = now;
					}
					return;
				}

				// some pets walk, some fly
				if (petType === "Walk") {
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
						if (debugEnabled && now - lastPrint > 3) {
							warn(`-------------------------------`);
							warn(`[STUDIO DEBUG]`);
							warn(`Above ground Y is NaN for ${petModel.Name}`);
							warn(`Raycast position: ${rayCast.Position.Y}`);
							warn(`Pet size: ${petSize.Y}`);
							warn(`Bounding box multiplier: ${boundingBoxMultiplier_Y}`);
							warn(`-------------------------------`);
							lastPrint = now;
						}
						return;
					}

					const aboveGroundCFrame = new CFrame(humanoidRootPart.CFrame.X, aboveGroundY, humanoidRootPart.CFrame.Z);
					const jumpCFrame = new CFrame(xPos, jumpingFactor, zPos);
					const petCFrame = aboveGroundCFrame.mul(jumpCFrame);

					if (isNan(petCFrame.X) || isNan(petCFrame.Y) || isNan(petCFrame.Z)) {
						if (debugEnabled && now - lastPrint > 3) {
							warn("[STUDIO DEBUG] petCFrame contains NaN");
							lastPrint = now;
						}
						return;
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
						if (debugEnabled && now - lastPrint > 3) {
							warn("[STUDIO DEBUG] orientedInPlayerDirection or lookingAtPlayer contains NaN");
							lastPrint = now;
						}
						return;
					}

					const petRotationCFrame = isMoving ? orientedInPlayerDirection : lookingAtPlayer;

					if (debugEnabled && now - lastPrint > 3) {
						warn(`-------------------------------`);
						warn(`[STUDIO DEBUG]`);
						warn(`Align Position Y: ${alignPosition.Position.Y}`);
						warn(`Align Orientation: ${petRotationCFrame.X} | ${petRotationCFrame.Y} | ${petRotationCFrame.Z}`);
						warn(
							`Oriented in player direction: ${orientedInPlayerDirection.X} | ${orientedInPlayerDirection.Y} | ${orientedInPlayerDirection.Z}`,
						);
						warn(`-------------------------------`);
						lastPrint = now;
					}

					// animate!
					alignPosition.Position = petCFrame.Position;
					alignOrientation.CFrame = petRotationCFrame;

					// set the secondary axis of the pet for some reason (idk)
					if (!isMoving) {
						alignOrientation.SecondaryAxis = new Vector3(0, 1, 0);
					}
				} else if (petType === "Fly") {
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
			} else if (animationType === "Following") {
				// calculate the colum pet is sorted into based on how many pets are equipped
				const spacing = 2.5;
				const columns = math.floor(math.sqrt(playerCache.pets.size()));
				const offset = new Vector3((-columns / 1.5) * spacing + spacing / 2, 0, 4);

				// calculate the x and z positions of the pet!
				const xCoord = (index % columns) * spacing;
				const zCoord = math.floor(index / columns);

				// some pets walk, some fly
				if (petType === "Walk") {
					const magicY = 20;
					const originPosition = new Vector3(0, magicY, 0);
					const raycastDirection = new Vector3(0, -100, 0);

					const rayCast = Workspace.Raycast(originPosition, raycastDirection, rayCastParams);
					if (rayCast === undefined) {
						return warn(`Raycast failed for ${petModel.Name}`);
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
				} else if (petType === "Fly") {
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
});
