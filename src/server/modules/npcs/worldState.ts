import { WorldNames } from "shared/configs/worlds";
import { Npc, ZoneNames } from "shared/configs/zones";

import { NpcCharacter } from "./isNpcCharacter";

type NpcState = { state: "FOLLOWING"; lastAttackTime: number } | { state: "WANDERING"; nextWanderTime: number };

export interface NpcInstance {
	npc: Npc;
	instance: NpcCharacter;
	spawn: NpcWorldState["zones"][number]["spawn"];
	state: NpcState;
	world: NpcWorldState;
}

export interface NpcWorldState {
	name: WorldNames;
	zones: Array<{
		name: ZoneNames;
		npcs: Array<NpcInstance>;
		spawn: {
			floor: BasePart;
			min: Vector3;
			max: Vector3;
		};
	}>;
}
