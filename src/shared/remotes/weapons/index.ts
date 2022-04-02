import Net from "@rbxts/net";

import { equipWeaponDefinition } from "./equipWeapon";
import { purchaseWeaponDefinition } from "./purchaseWeapon";

export const weapons = Net.Definitions.Namespace({
	equipWeapon: equipWeaponDefinition,
	purchaseWeapon: purchaseWeaponDefinition,
});
