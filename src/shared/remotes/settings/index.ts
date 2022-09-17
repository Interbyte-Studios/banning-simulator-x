import Net from "@rbxts/net";

import { autoDelete } from "./autoDelete";
import { gameplay } from "./gameplay";
import { sound } from "./sound";
import { visual } from "./visual";

export const settings = Net.Definitions.Namespace({
	autoDelete: autoDelete,
	gameplay: gameplay,
	sound: sound,
	visual: visual,
});
