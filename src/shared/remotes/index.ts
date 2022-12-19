import Net from "@rbxts/net";

import { damageNPCDefinition } from "./damageNPC";
import { eggs } from "./eggs";
import { equipTitleDefinition } from "./equipTitle";
import { media } from "./media";
import { petMastery } from "./petMastery";
import { pets } from "./pets";
import { purchaseZoneDefinition } from "./purchaseZone";
import { redeemQuestDefinition } from "./redeemQuest";
import { roduxDefinitions } from "./rodux";
import { settings } from "./settings";
import { spinWheelDefinition } from "./spinWheel";
import { spinWheelInfoDefinition } from "./spinWheelnfo";
import { talismans } from "./talismans";
import { unlockRankDefinition } from "./unlockRank";
import { weapons } from "./weapons";

export const remotes = Net.Definitions.Create({
	eggs: eggs,
	media: media,
	pets: pets,
	petMastery: petMastery,
	rodux: roduxDefinitions,
	settings: settings,
	weapons: weapons,
	talismans: talismans,

	equipTitle: equipTitleDefinition,
	damageNPC: damageNPCDefinition,
	purchaseZone: purchaseZoneDefinition,
	redeemQuest: redeemQuestDefinition,
	unlockRank: unlockRankDefinition,
	spinWheel: spinWheelDefinition,
	spinWheelInfo: spinWheelInfoDefinition,
});
