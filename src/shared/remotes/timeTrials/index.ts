import Net from "@rbxts/net";

import { startTimeTrialDefinition } from "./startTimeTrial";
import { upgradeTimeTrialsDefinition } from "./upgradeTimeTrial";

export const timeTrials = Net.Definitions.Namespace({
	upgradeTimeTrials: upgradeTimeTrialsDefinition,
	startTimeTrial: startTimeTrialDefinition,
});
