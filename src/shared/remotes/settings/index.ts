import Net from "@rbxts/net";

import { autoDelete } from "./autoDelete";
import { gameplay } from "./gameplay";
import { privacy } from "./privacy";
import { sound } from "./sound";
import { visual } from "./visual";

export const settings = Net.Definitions.Namespace({
	autoDelete: autoDelete,
	gameplay: gameplay,
	sound: sound,
	visual: visual,
	privacy: privacy,
});
