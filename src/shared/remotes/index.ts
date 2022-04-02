/* eslint-disable @typescript-eslint/no-namespace */
import Net from "@rbxts/net";

import { auras } from "./auras";
import { roduxDefinitions } from "./rodux";
import { weapons } from "./weapons";

export const remotes = Net.Definitions.Create({
	rodux: roduxDefinitions,

	auras: auras,
	weapons: weapons,
});
