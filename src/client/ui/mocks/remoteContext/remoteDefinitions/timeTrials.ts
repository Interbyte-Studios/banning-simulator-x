import { CreateTimeTrialDefinition } from "shared/remotes/timeTrials/createTimeTrial";
import { StartTimeTrialDefinition } from "shared/remotes/timeTrials/startTimeTrial";
import { StopTimeTrialDefinition } from "shared/remotes/timeTrials/stopTimeTrial";
import { UpgradeTimeTrialsDefinition } from "shared/remotes/timeTrials/upgradeTimeTrial";

import { fakeRemoteCall } from "../fakeRemoteCall";

/**
 *  This is the remote context for the time trials remote functions.
 */
export const timeTrialsRemoteContext = {
	upgradeTimeTrial: fakeRemoteCall<UpgradeTimeTrialsDefinition>("upgradeTimeTrial"),
	createTimeTrial: fakeRemoteCall<CreateTimeTrialDefinition>("createTimeTrial"),
	startTimeTrial: fakeRemoteCall<StartTimeTrialDefinition>("startTimeTrial"),
	stopTimeTrial: fakeRemoteCall<StopTimeTrialDefinition>("stopTimeTrial"),
};
