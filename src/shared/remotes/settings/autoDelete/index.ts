import Net from "@rbxts/net";

import { toggleAutoDeleteDefinition } from "./toggleAutoDelete";
import { toggleEasyLegendariesAutoDeleteDefinition } from "./toggleEasyLegendariesAutoDelete";

export const autoDelete = Net.Definitions.Namespace({
	toggleAutoDelete: toggleAutoDeleteDefinition,
	toggleEasyLegendariesAutoDelete: toggleEasyLegendariesAutoDeleteDefinition,
});
