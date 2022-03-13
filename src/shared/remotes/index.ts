import Net from "@rbxts/net";

import { roduxDefinitions } from "./rodux";
import { equipWeaponDefinition } from "./weapons/equipWeapon";

export const remotes = Net.Definitions.Create({
	rodux: roduxDefinitions,

	equipWeapon: equipWeaponDefinition,
});
