import { Workspace } from "@rbxts/services";
import { WORLDS } from "shared/configs/worlds";

import { runStep } from "./modules/npcs/runStep";
import { NpcWorldState } from "./modules/npcs/worldState";

// generate world state
const npcState = [];

for (const [worldName, worldInfo] of pairs(WORLDS)) {
	// create npcs
	const world = Workspace.worlds[worldName];

	const zones: NpcWorldState["zones"] = [];

	const worldState: NpcWorldState = {
		zones: zones,
	};
	npcState.push(worldState);

	for (const zone of worldInfo.zones) {
		const zoneFolder = world.zones.FindFirstChild(zone.name);
		assert(zoneFolder, `World ${worldName} did not contain zone ${zone.name}`);

		// get floor to spawn on
		const floor = zoneFolder.FindFirstChild("floor");
		assert(floor, `Failed to get floor for ${zoneFolder.GetFullName()}`);
		assert(floor.IsA("BasePart"), `Found floor "${floor.GetFullName()}" but it was not a BasePart`);

		const { Position: position, Size: size } = floor;
		const halfSize = size.div(2).mul(new Vector3(1, 0, 1));

		const halfHeight = position.add(new Vector3(0, size.Y, 0));

		zones.push({
			npcs: [],
			spawn: {
				floor,
				min: position.sub(halfSize).add(halfHeight),
				max: position.add(halfSize).add(halfHeight),
			},
		});
	}
}

// eslint-disable-next-line no-constant-condition
while (true) {
	// run step
	runStep(npcState, [], time());

	task.wait();
}
