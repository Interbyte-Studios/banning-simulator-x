import { Players, RunService, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { cachePetForAnimation } from "client/modules/pets/createPetFollow";
import {
	createPetAnimationCache,
	getPetAnimationCache,
	removePetAnimationCache,
} from "client/modules/pets/petAnimationCache";
import { removePet } from "client/modules/pets/unequipPet";
import { isValidPetAnimationType, ValidPetAnimationType } from "shared/rodux/settings";

const radius = math.pi * 2;

/**
 *
 * @param angle The angle where the pet gets its position.
 * @param totalPets The amount of pets the player equipped.
 * @param settingsDistance The amount of distance manually added by the player.
 * @returns The positions for the pets around the player.
 */
function getXandZ(angle: number, totalPets: number, settingsDistance: number): { xCoord: number; zCoord: number } {
	const petsForAngle = totalPets + 0.5 + settingsDistance / 3;
	const xCoord = math.cos(angle) * petsForAngle;
	const zCoord = math.sin(angle) * petsForAngle;

	return { xCoord, zCoord };
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
			print("Caching player pet animation");
			const initialState = store.getState();

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

				newState.pets.forEach((pet) => {
					if (!pet.equipped) {
						const cachedPetIndex = playerCache.pets.findIndex((animatedPet) => animatedPet.guid === pet.guid);
						if (cachedPetIndex === undefined) {
							return;
						}

						playerCache.pets.unorderedRemove(cachedPetIndex);
						removePet(pet.guid);
					} else {
						const storedPet = playerCache.pets.find((animatedPet) => animatedPet.guid === pet.guid);
						if (storedPet !== undefined) {
							return;
						}

						const createdPet = cachePetForAnimation(player, pet.id, pet.guid, pet.variant);
						createdPet.model.Parent = playerCache.petsDisplayed.Value ? Workspace["client objects"].pets : undefined;
						playerCache.pets.push(createdPet);
					}
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

RunService.BindToRenderStep("PETS", Enum.RenderPriority.Character.Value, () => {
	const currentCacheState = getPetAnimationCache();

	for (const playerCache of currentCacheState) {
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

		playerCache.pets.forEach((pet, index) => {
			if (pet.model.Parent === undefined) {
				return;
			}

			if (!isValidPetAnimationType(playerCache.animationType.Value)) {
				return;
			}

			const equippedPets = playerCache.pets.size();
			const petAngle = index / (radius / equippedPets);
			const { xCoord, zCoord } = getXandZ(petAngle, equippedPets, playerCache.distance.Value);

			/// Variables
			const alignPosition = pet.alignPosition;
			const alignOrientation = pet.alignOrientation;
			const isMoving = humanoid.MoveDirection.Magnitude > 0;
			const petModel = pet.model;

			/// Values
			const now = time();
			const petType = pet.petType;
			const primaryPart = petModel.PrimaryPart;
			if (primaryPart === undefined) {
				return;
			}

			const petSize = petModel.GetExtentsSize();
			const petJump = math.clamp(math.cos(now * 24) * 2, 0, 2);
			const petRotate = math.cos(now * 10) * 30;

			const petHover = math.cos(now * 3) * 1.2;
			const petFace = math.clamp(math.cos(now * 2) * 10, 0, 10);

			const rayCastParams = new RaycastParams();
			rayCastParams.IgnoreWater = true;
			rayCastParams.FilterType = Enum.RaycastFilterType.Blacklist;
			rayCastParams.FilterDescendantsInstances = [character, petModel];

			if (petType === "Walk") {
				const rayCast = Workspace.Raycast(
					humanoidRootPart.Position.add(new Vector3(xCoord, 20, zCoord)),
					new Vector3(0, -100, 0),
				);

				if (rayCast === undefined) {
					return;
				}

				if (rayCast.Instance.CanCollide === false) {
					return;
				}

				if (isMoving) {
					alignPosition.Position = new CFrame(
						humanoidRootPart.CFrame.X,
						rayCast.Position.Y + petSize.Y / (petSize.Y * 2),
						humanoidRootPart.CFrame.Z,
					).mul(new CFrame(xCoord, petJump, zCoord)).Position;
					alignOrientation.CFrame = humanoidRootPart.CFrame.mul(CFrame.Angles(math.rad(petRotate), 0, 0));
				} else {
					alignPosition.Position = new CFrame(
						humanoidRootPart.CFrame.X,
						rayCast.Position.Y + petSize.Y / (petSize.Y * 1.1),
						humanoidRootPart.CFrame.Z,
					).mul(new CFrame(xCoord, 0, zCoord)).Position;
					alignOrientation.CFrame = CFrame.lookAt(primaryPart.Position, humanoidRootPart.Position);
					alignOrientation.SecondaryAxis = new Vector3(0, 1, 0);
				}
			} else if (petType === "Fly") {
				if (isMoving) {
					alignPosition.Position = new CFrame(
						humanoidRootPart.CFrame.X,
						humanoidRootPart.Position.Y,
						humanoidRootPart.CFrame.Z,
					).mul(new CFrame(xCoord, petHover, zCoord)).Position;
					alignOrientation.CFrame = humanoidRootPart.CFrame.mul(CFrame.Angles(math.rad(petFace), 0, 0));
				} else {
					alignPosition.Position = new CFrame(
						humanoidRootPart.CFrame.X,
						humanoidRootPart.Position.Y,
						humanoidRootPart.CFrame.Z,
					).mul(new CFrame(xCoord, petHover, zCoord)).Position;
					alignOrientation.CFrame = CFrame.lookAt(primaryPart.Position, humanoidRootPart.Position).mul(
						CFrame.Angles(math.rad(petFace), 0, 0),
					);
				}
			}
		});
	}
});
