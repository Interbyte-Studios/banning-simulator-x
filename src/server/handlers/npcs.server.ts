import { Workspace } from "@rbxts/services";
import { withPlayerStore } from "server/modules/net/withPlayerStore";
import { WORLDS } from "shared/configs/worlds";
import { UniversalWorldData } from "shared/configs/zones";
import { remotes } from "shared/remotes";
import { NpcCharacter } from "shared/remotes/damageNPC";
import { Store } from "shared/rodux";

import { runStep } from "../modules/npcs/runStep";
import { NpcWorldState } from "../modules/npcs/worldState";

// log npc attacks
const _lastAttack: Map<number, number> = new Map();
const attackDownTime = 0.5;

let npcAttacks: Array<{ player: Player; store: Store; character: NpcCharacter }> = [];
remotes.Server.Get("damageNPC").Connect(
	withPlayerStore((player, store, character) => {
		const currentState = store.getState();
		for (const [worldName, worldData] of pairs(UniversalWorldData)) {
			for (const [zoneName, zoneData] of pairs(worldData)) {
				const npcData = zoneData.npcs.find((npcData) => npcData.name === character.Name);
				if (npcData === undefined) {
					continue;
				}

				const ownsWorld = currentState.worlds.find((storedWorld) => storedWorld.name === worldName);
				if (ownsWorld === undefined) {
					warn("Doesn't own world");
					return;
				}

				const ownsZone = ownsWorld.zones.find((storedZone) => storedZone === zoneName);
				if (ownsZone === undefined) {
					return;
				}
			}
		}

		const now = time();
		const lastAttack = _lastAttack.get(player.UserId);
		if (lastAttack === undefined) {
			_lastAttack.set(player.UserId, now);
		} else {
			if (now - lastAttack < attackDownTime) {
				return;
			}
			_lastAttack.set(player.UserId, now);
		}

		const npcAttack = {
			player,
			store,
			character,
		};
		npcAttacks.push(npcAttack);
	}),
);

// generate world state
const npcState = [];

for (const [worldName, worldInfo] of pairs(WORLDS)) {
	// create npcs
	const world = Workspace.worlds[worldName];

	const zones: NpcWorldState["zones"] = [];

	const worldState: NpcWorldState = {
		name: worldName,
		zones: zones,
	};
	npcState.push(worldState);

	for (const [zoneName] of pairs(worldInfo.zones)) {
		const zoneFolder = world.zones.FindFirstChild(zoneName);
		assert(zoneFolder, `World ${worldName} did not contain zone ${zoneName}`);

		// get floor to spawn on
		const floor = zoneFolder.FindFirstChild("floor");
		assert(floor, `Failed to get floor for ${zoneFolder.GetFullName()}`);
		assert(floor.IsA("BasePart"), `Found floor "${floor.GetFullName()}" but it was not a BasePart`);

		const { Position: position, Size: size } = floor;
		const halfSize = size.div(2).mul(new Vector3(1, 0, 1));

		const halfHeight = new Vector3(0, size.Y / 2, 0);

		zones.push({
			name: zoneName,
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
	runStep(npcState, npcAttacks, time());
	npcAttacks = [];

	task.wait();
}
