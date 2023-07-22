import Net from "@rbxts/net";

import { upgradeTimeTrialsDefinition } from "./upgradeTimeTrial";

export const timeTrials = Net.Definitions.Namespace({
	upgradeTimeTrials: upgradeTimeTrialsDefinition,
});
