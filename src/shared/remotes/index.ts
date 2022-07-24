import Net from "@rbxts/net";

import { eggs } from "./eggs";
import { equipTitleDefinition } from "./equipTitle";
import { purchaseZoneDefiinition } from "./purchaseZone";
import { redeemQuestDefinition } from "./redeemQuest";
import { roduxDefinitions } from "./rodux";
import { settings } from "./settings";
import { weapons } from "./weapons";

export const remotes = Net.Definitions.Create({
	eggs: eggs,
	rodux: roduxDefinitions,
	settings: settings,
	weapons: weapons,

	equipTitle: equipTitleDefinition,

	purchaseZone: purchaseZoneDefiinition,
	redeemQuest: redeemQuestDefinition,
});
