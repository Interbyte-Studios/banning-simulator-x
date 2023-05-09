import { RedeemQuestDefinition } from "shared/remotes/redeemQuest";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 * This is the remote context for the quests remote functions.
 */
export const questsRemoteContext = {
	redeemQuest: fakeRemoteCall<RedeemQuestDefinition>("redeemQuest"),
};
