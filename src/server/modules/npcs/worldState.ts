import { WorldName } from "shared/configs/worlds";
import { Npc, ZoneNames } from "shared/configs/zones";

type NpcState = { nextWanderTime: number };

export interface NpcInstance {
	npc: Npc;
	instance: BasePart;
	spawn: NpcWorldState["zones"][number]["spawn"];
	state: NpcState;
	world: NpcWorldState;
	lerpTarget?: Vector3;
	lerpProgress?: number;
}

export interface NpcWorldState {
	name: WorldName;
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
