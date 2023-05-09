import { UnlockRankDefinition } from "shared/remotes/unlockRank";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the ranks remote functions.
 */
export const ranksRemoteContext = {
	unlockRank: fakeRemoteCall<UnlockRankDefinition>("unlockRank"),
};
