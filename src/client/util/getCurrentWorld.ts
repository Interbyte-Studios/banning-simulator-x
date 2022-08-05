import { Players, Workspace } from "@rbxts/services";
import { WorldName } from "shared/configs/worlds";

const landingParts: Array<Instance> = [];

for (const world of Workspace.worlds.GetChildren()) {
	const landing = world.FindFirstChild("landing");
	assert(landing, `Expected to find landing parts in world ${world.Name}`);

	for (const part of landing.GetChildren()) {
		landingParts.push(part);
	}
}

/**
 * Returns the world the player is currently in.
 *
 * @returns The world the player is currently in.
 */
export function getCurrentWorld(): WorldName | void {
	const character = Players.LocalPlayer.Character;
	if (character === undefined) {
		return;
	}

	const humanoid = character.FindFirstChildWhichIsA("Humanoid");
	if (humanoid === undefined) {
		return;
	}

	const humanoidRootPart = humanoid.RootPart;
	if (humanoidRootPart === undefined) {
		return;
	}

	const rayOrigin = humanoidRootPart.Position;
	const rayDirection = new Vector3(0, -500, 0);

	const raycastParams = new RaycastParams();
	raycastParams.FilterDescendantsInstances = landingParts;
	raycastParams.FilterType = Enum.RaycastFilterType.Whitelist;

	const raycastResult = Workspace.Raycast(rayOrigin, rayDirection, raycastParams);
	if (raycastResult === undefined) {
		return;
	}

	const hitPart = raycastResult.Instance;
	if (hitPart === undefined) {
		return;
	}

	const world = hitPart.Parent?.Parent;
	if (world === undefined) {
		return;
	}

	return world.Name as WorldName;
}
