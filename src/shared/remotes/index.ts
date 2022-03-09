import Net from "@rbxts/net";

import { storeChangeDefinition } from "./rodux";
import { equipWeaponDefinition } from "./weapons/equipWeapon";

export const remotes = Net.Definitions.Create({
	storeChange: storeChangeDefinition,
	equipWeapon: equipWeaponDefinition,
});
