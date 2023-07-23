import { UpgradeTimeTrialsDefinition } from "shared/remotes/timeTrials/upgradeTimeTrial";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the time trials remote functions.
 */
export const timeTrialsRemoteContext = {
	upgradeTimeTrial: fakeRemoteCall<UpgradeTimeTrialsDefinition>("upgradeTimeTrial"),
};
