import Net from "@rbxts/net";

import { eggs } from "./eggs";
import { equipTitleDefinition } from "./equipTitle";
import { purchaseZoneDefinition } from "./purchaseZone";
import { redeemQuestDefinition } from "./redeemQuest";
import { roduxDefinitions } from "./rodux";
import { settings } from "./settings";
import { unlockRankDefinition } from "./unlockRank";
import { weapons } from "./weapons";

export const remotes = Net.Definitions.Create({
	eggs: eggs,
	rodux: roduxDefinitions,
	settings: settings,
	weapons: weapons,

	equipTitle: equipTitleDefinition,

	purchaseZone: purchaseZoneDefinition,
	redeemQuest: redeemQuestDefinition,

	unlockRank: unlockRankDefinition,
});
