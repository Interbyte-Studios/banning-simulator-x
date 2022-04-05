import Net from "@rbxts/net";

import { roduxDefinitions } from "./rodux";
import { weapons } from "./weapons";

export const remotes = Net.Definitions.Create({
	rodux: roduxDefinitions,

	weapons: weapons,
});
