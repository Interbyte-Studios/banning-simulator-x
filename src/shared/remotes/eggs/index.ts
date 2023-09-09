import Net from "@rbxts/net";

import { conveyHatchDefinition } from "./conveyHatch";
import { hatchEggDefinition } from "./hatchEgg";
import { hatchSystemMessageDefinition } from "./hatchSystemMessage";

export const eggs = Net.Definitions.Namespace({
	hatchEgg: hatchEggDefinition,
	hatchEggSystemMessage: hatchSystemMessageDefinition,
	conveyHatch: conveyHatchDefinition,
});
