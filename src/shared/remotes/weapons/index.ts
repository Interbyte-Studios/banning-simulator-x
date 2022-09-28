import Net from "@rbxts/net";

import { changeWeaponDefinition } from "./changeWeapon";
import { equipWeaponDefinition } from "./equipWeapon";
import { purchaseWeaponDefinition } from "./purchaseWeapon";
import { unequipWeaponDefinition } from "./unequipWeapon";

export const weapons = Net.Definitions.Namespace({
	changeWeapon: changeWeaponDefinition,
	equipWeapon: equipWeaponDefinition,
	unequipWeapon: unequipWeaponDefinition,
	purchaseWeapon: purchaseWeaponDefinition,
});
