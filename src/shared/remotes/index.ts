import Net from "@rbxts/net";

import { eggs } from "./eggs";
import { roduxDefinitions } from "./rodux";
import { settings } from "./settings";
import { weapons } from "./weapons";

export const remotes = Net.Definitions.Create({
	eggs: eggs,
	rodux: roduxDefinitions,
	settings: settings,
	weapons: weapons,
});
