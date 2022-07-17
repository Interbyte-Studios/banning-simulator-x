import Net from "@rbxts/net";

import { eggs } from "./eggs";
import { equipTitleDefinition } from "./equipTitle";
import { purchaseZoneDefiinition } from "./purchaseZone";
import { roduxDefinitions } from "./rodux";
import { weapons } from "./weapons";

export const remotes = Net.Definitions.Create({
	eggs: eggs,

	rodux: roduxDefinitions,

	weapons: weapons,

	equipTitle: equipTitleDefinition,

	purchaseZone: purchaseZoneDefiinition,
});
