import { Players, RunService, Workspace } from "@rbxts/services";
import { onStoreCreated } from "client/clientStores";
import { createPetFollow, PetCreated } from "client/modules/pets/createPetFollow";
import { removePet } from "client/modules/pets/unequipPet";
import { ValidPetAnimationType } from "shared/rodux/settings";

const player = Players.LocalPlayer;

const radius = math.pi * 2;
const animatedPets: Array<PetCreated> = [];

const hidePets = new Instance("BoolValue");
const distanceValue = new Instance("IntValue");

/**
 *
 * @param angle The angle where the pet gets its position.
 * @param totalPets The amount of pets the player equipped.
 * @param settingsDistance The amount of distance manually added by the player.
 * @returns The positions for the pets around the player.
 */
function getXandZ(angle: number, totalPets: number, settingsDistance: number): { x: number; z: number } {
	const petsForAngle = totalPets + 0.5 + settingsDistance / 3;
	const x = math.cos(angle) * petsForAngle;
	const z = math.sin(angle) * petsForAngle;

	return { x, z };
}

/**
 *
 * @param player The player requested for..
 * @returns Amount of equipped pets by the player.
 */
function getOwnedPets(player: Player): number {
	let counter = 0;

	animatedPets.forEach((pet) => {
		if (pet.owner.UserId === player.UserId) {
			counter += 1;
		}
	});

	return counter;
}

RunService.BindToRenderStep("PETS", Enum.RenderPriority.Character.Value, () => {
	for (const [index, pet] of pairs(animatedPets)) {
		if (pet.model.Parent === undefined) {
			continue;
		}

		const character = player.Character;
		if (character === undefined) {
			continue;
		}

		const humanoidRootPart = character.PrimaryPart;
		if (humanoidRootPart === undefined) {
			continue;
		}

		const ownedPets = getOwnedPets(pet.owner);
		const angle = index * (radius / ownedPets);
		const { x, z } = getXandZ(angle, ownedPets, distanceValue.Value);
		const humanoid = character.WaitForChild("Humanoid") as Humanoid;

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
			continue;
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
			const rayCast = Workspace.Raycast(humanoidRootPart.Position.add(new Vector3(x, 20, z)), new Vector3(0, -100, 0));
			if (rayCast === undefined) {
				continue;
			}

			if (rayCast.Instance.CanCollide === false) {
				continue;
			}

			if (isMoving) {
				alignPosition.Position = new CFrame(
					humanoidRootPart.CFrame.X,
					rayCast.Position.Y + petSize.Y / (petSize.Y * 2),
					humanoidRootPart.CFrame.Z,
				).mul(new CFrame(x, petJump, z)).Position;
				alignOrientation.CFrame = humanoidRootPart.CFrame.mul(CFrame.Angles(math.rad(petRotate), 0, 0));
			} else {
				alignPosition.Position = new CFrame(
					humanoidRootPart.CFrame.X,
					rayCast.Position.Y + petSize.Y / (petSize.Y * 1.1),
					humanoidRootPart.CFrame.Z,
				).mul(new CFrame(x, 0, z)).Position;
				alignOrientation.CFrame = CFrame.lookAt(primaryPart.Position, humanoidRootPart.Position);
				alignOrientation.SecondaryAxis = new Vector3(0, 1, 0);
			}
		} else if (petType === "Fly") {
			if (isMoving) {
				alignPosition.Position = new CFrame(
					humanoidRootPart.CFrame.X,
					humanoidRootPart.Position.Y,
					humanoidRootPart.CFrame.Z,
				).mul(new CFrame(x, petHover, z)).Position;
				alignOrientation.CFrame = humanoidRootPart.CFrame.mul(CFrame.Angles(math.rad(petFace), 0, 0));
			} else {
				alignPosition.Position = new CFrame(
					humanoidRootPart.CFrame.X,
					humanoidRootPart.Position.Y,
					humanoidRootPart.CFrame.Z,
				).mul(new CFrame(x, petHover, z)).Position;
				alignOrientation.CFrame = CFrame.lookAt(primaryPart.Position, humanoidRootPart.Position).mul(
					CFrame.Angles(math.rad(petFace), 0, 0),
				);
			}
		}
	}
});

hidePets.Changed.Connect((Value) => {
	for (const [, pet] of pairs(animatedPets)) {
		pet.model.Parent = Value === true ? Workspace["client objects"].pets : undefined;
	}
});

onStoreCreated(player)
	.andThen((store) => {
		const initialState = store.getState();
		const settings = initialState.settings;
		const playerPets = initialState.pets;

		hidePets.Value = settings.visual.petsDisplayed;
		distanceValue.Value = settings.visual.petsStudsOfDistance;

		playerPets.forEach((pet) => {
			if (!pet.equipped) {
				return;
			}

			if (initialState.settings.visual.petAnimationType === "Surrounding") {
				const createdPet = createPetFollow(player, pet.id, pet.guid, pet.variant);
				createdPet.model.Parent = settings.visual.petsDisplayed === true ? Workspace["client objects"].pets : undefined;
				animatedPets.push(createdPet);
			} else {
			}
		});

		store.changed.connect((newState, oldState) => {
			if (newState.settings.visual !== oldState.settings.visual) {
				hidePets.Value = newState.settings.visual.petsDisplayed;
				distanceValue.Value = newState.settings.visual.petsStudsOfDistance;
			}

			if (newState.pets === oldState.pets) {
				return;
			}

			const updatedPlayerPets = newState.pets;
			updatedPlayerPets.forEach((pet) => {
				if (!pet.equipped) {
					const cachedPetIndex = animatedPets.findIndex((animatedPet) => animatedPet.guid === pet.guid);
					if (cachedPetIndex !== undefined) {
						animatedPets.unorderedRemove(cachedPetIndex);
						removePet(pet.guid);
					}
				} else {
					const storedPet = animatedPets.find((animatedPet) => animatedPet.guid === pet.guid);
					if (storedPet !== undefined) {
						return;
					}

					const createdPet = createPetFollow(player, pet.id, pet.guid, pet.variant);
					createdPet.model.Parent =
						settings.visual.petsDisplayed === true ? Workspace["client objects"].pets : undefined;
					animatedPets.push(createdPet);
				}
			});
		});
	})
	.catch((e) => {
		throw `Failed to get store for player ${player.Name} | ${e}`;
	});
