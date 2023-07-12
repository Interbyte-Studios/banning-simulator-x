import Net from "@rbxts/net";

import { hasClickedPlayDefinition } from "./hasClickedPlay";
import { roactMountedDefinition } from "./roactMounted";

export const playerLoaded = Net.Definitions.Namespace({
	roactMounted: roactMountedDefinition,
	hasClickedPlay: hasClickedPlayDefinition,
});
