import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const equipWeaponDefinition = Net.Definitions.ClientToServerEvent<[weaponId: number]>([
	createTypeChecker(t.integer),
]);
