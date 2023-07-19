import Net from "@rbxts/net";

import { accolades } from "./accolades";
import { admin } from "./admin";
import { useBoostDefinition } from "./boosts";
import { claimInvitedFriendDefinition } from "./claimInvitedFriend";
import { damageNPCDefinition } from "./damageNPC";
import { eggs } from "./eggs";
import { equipTitleDefinition } from "./equipTitle";
import { fusionRequestDefinition } from "./fusing";
import { gamepassGiftReceivedDefinition, useGamepassGiftDefinition } from "./gamepasses";
import { media } from "./media";
import { petMastery } from "./petMastery";
import { pets } from "./pets";
import { playerLoaded } from "./playerLoaded";
import { purchaseZoneDefinition } from "./purchaseZone";
import { redeemQuestDefinition } from "./redeemQuest";
import { rewardsDefinition } from "./rewards";
import { roduxDefinitions } from "./rodux";
import { settings } from "./settings";
import { spinWheelDefinition } from "./spinWheel";
import { spinWheelInfoDefinition } from "./spinWheelnfo";
import { talismans } from "./talismans";
import { trading } from "./trading";
import { unlockRankDefinition } from "./unlockRank";
import { weapons } from "./weapons";
import { worldPrestige } from "./worldPrestige";

export const remotes = Net.Definitions.Create({
	accolades: accolades,
	admin: admin,
	eggs: eggs,
	media: media,
	pets: pets,
	petMastery: petMastery,
	playerLoaded: playerLoaded,
	rewards: rewardsDefinition,
	rodux: roduxDefinitions,
	settings: settings,
	weapons: weapons,
	worldPrestige: worldPrestige,
	talismans: talismans,
	trades: trading,

	useGamepassGift: useGamepassGiftDefinition,
	gamepassGiftReceived: gamepassGiftReceivedDefinition,
	claimInvitedFriend: claimInvitedFriendDefinition,
	equipTitle: equipTitleDefinition,
	damageNPC: damageNPCDefinition,
	purchaseZone: purchaseZoneDefinition,
	redeemQuest: redeemQuestDefinition,
	unlockRank: unlockRankDefinition,
	spinWheel: spinWheelDefinition,
	spinWheelInfo: spinWheelInfoDefinition,
	requestFusion: fusionRequestDefinition,
	useBoost: useBoostDefinition,
});
