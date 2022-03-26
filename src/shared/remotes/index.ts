import Net from "@rbxts/net";

import { equipAuraDefinition } from "./auras/equipAura";
import { roduxDefinitions } from "./rodux";
import { equipWeaponDefinition } from "./weapons/equipWeapon";

export const remotes = Net.Definitions.Create({
	rodux: roduxDefinitions,

	equipAura: equipAuraDefinition,
	equipWeapon: equipWeaponDefinition,
});
