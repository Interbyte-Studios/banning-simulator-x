import Net from "@rbxts/net";

import { addOrRemoveToAutoDeleteDefinition } from "./toggleAutoDelete";

export const autoDelete = Net.Definitions.Namespace({
	addOrRemoveToAutoDelete: addOrRemoveToAutoDeleteDefinition,
});
