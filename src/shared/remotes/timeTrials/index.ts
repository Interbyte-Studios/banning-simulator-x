import Net from "@rbxts/net";

import { createTimeTrialDefinition } from "./createTimeTrial";
import { startTimeTrialDefinition } from "./startTimeTrial";
import { upgradeTimeTrialsDefinition } from "./upgradeTimeTrial";

export const timeTrials = Net.Definitions.Namespace({
	upgradeTimeTrials: upgradeTimeTrialsDefinition,
	startTimeTrial: startTimeTrialDefinition,
	createTimeTrial: createTimeTrialDefinition,
});
