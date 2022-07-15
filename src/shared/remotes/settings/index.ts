import Net from "@rbxts/net";

import { gameplay } from "./gameplay";
import { sound } from "./sound";
import { visual } from "./visual";

export const settings = Net.Definitions.Namespace({
	gameplay: gameplay,
	sound: sound,
	visual: visual,
});
