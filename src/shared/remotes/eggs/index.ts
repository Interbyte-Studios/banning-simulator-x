import Net from "@rbxts/net";

import { hatchEggDefinition } from "./hatchEgg";
import { hatchSingleExclusivePetDefinition } from "./hatchExclusiveEgg";
import { hatchSystemMessageDefinition } from "./hatchSystemMessage";
import { hatchTripleExclusivePetDefinition } from "./hatchTripleExclusiveEgg";

export const eggs = Net.Definitions.Namespace({
	hatchEgg: hatchEggDefinition,
	hatchEggSystemMessage: hatchSystemMessageDefinition,
	hatchSingleExclusiveEgg: hatchSingleExclusivePetDefinition,
	hatchTripleExclusiveEgg: hatchTripleExclusivePetDefinition,
});
