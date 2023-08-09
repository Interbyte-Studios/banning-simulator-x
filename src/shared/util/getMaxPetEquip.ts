import { Workspace } from "@rbxts/services";
import { DEFAULT_EQUIP_AMOUNT } from "shared/configs/pets";
import { GamepassesState } from "shared/rodux/gamepasses";

import { isValidWorld } from "./isValidWorld";

/**
 * Returns the number of pets a player can have equipped.
 *
 * @param player The player object.
 * @param gamepasses The gamepasses state.
 * @returns The amount of pets a player can equip.
 */
export function getMaxPetEquip(player: Player, gamepasses: GamepassesState): number {
	let additionalPets = 0;
	if (gamepasses["+2 Pets Equipped"]) {
		additionalPets += 2;
	}

	if (gamepasses["+3 Pets Equipped"]) {
		additionalPets += 3;
	}

	const character = player.Character;
	if (character === undefined) {
		return DEFAULT_EQUIP_AMOUNT + additionalPets;
	}

	const humanoid = character.WaitForChild("Humanoid") as Humanoid;
	if (humanoid === undefined) {
		return DEFAULT_EQUIP_AMOUNT + additionalPets;
	}

	const humanoidRootPart = humanoid.RootPart;
	if (humanoidRootPart === undefined) {
		return DEFAULT_EQUIP_AMOUNT + additionalPets;
	}

	const landingParts: Array<Instance> = [];

	for (const world of Workspace.worlds.GetChildren()) {
		const landing = world.FindFirstChild("landing");
		assert(landing, `Expected to find landing parts in world ${world.Name}`);

		for (const part of landing.GetChildren()) {
			landingParts.push(part);
		}
	}

	const rayOrigin = humanoidRootPart.Position;
	const rayDirection = new Vector3(0, -500, 0);

	const raycastParams = new RaycastParams();
	raycastParams.FilterDescendantsInstances = landingParts;
	raycastParams.FilterType = Enum.RaycastFilterType.Include;

	const raycastResult = Workspace.Raycast(rayOrigin, rayDirection, raycastParams);
	if (raycastResult === undefined) {
		return DEFAULT_EQUIP_AMOUNT + additionalPets;
	}

	const hitPart = raycastResult.Instance;
	if (hitPart === undefined) {
		return DEFAULT_EQUIP_AMOUNT + additionalPets;
	}

	const world = hitPart.Parent?.Parent;
	if (world === undefined) {
		return DEFAULT_EQUIP_AMOUNT + additionalPets;
	}

	if (!isValidWorld(world.Name)) {
		return DEFAULT_EQUIP_AMOUNT + additionalPets;
	}

	return DEFAULT_EQUIP_AMOUNT + additionalPets;
}
