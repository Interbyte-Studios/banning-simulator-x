import Net from "@rbxts/net";

import { createTimeTrialDefinition } from "./createTimeTrial";
import { upgradeTimeTrialsDefinition } from "./upgradeTimeTrial";

export const timeTrials = Net.Definitions.Namespace({
	upgradeTimeTrials: upgradeTimeTrialsDefinition,
	createTimeTrial: createTimeTrialDefinition,
});
