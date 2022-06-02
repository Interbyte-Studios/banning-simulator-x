import Net from "@rbxts/net";

import { relayHatchDefinition } from "./relayHatchInfo";
import { requestHatchDefinition } from "./requestHatch";

export const eggs = Net.Definitions.Namespace({
	requestHatch: requestHatchDefinition,
	relayHatch: relayHatchDefinition,
});
