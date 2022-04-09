import { Npc } from "shared/configs/zones";

import { NpcCharacter } from "./isNpcCharacter";

type NpcState = { state: "FOLLOWING"; lastAttackTime: number } | { state: "WANDERING"; nextWanderTime: number };

export interface NpcInstance {
	npc: Npc;
	instance: NpcCharacter;
	spawn: NpcWorldState["zones"][number]["spawn"];
	state: NpcState;
}

export interface NpcWorldState {
	zones: Array<{
		npcs: Array<NpcInstance>;
		spawn: {
			floor: BasePart;
			min: Vector3;
			max: Vector3;
		};
	}>;
}
