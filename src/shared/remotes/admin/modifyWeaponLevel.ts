import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const admin_ModifyWeaponLevelDefinition = Net.Definitions.ClientToServerEvent<
	[
		targetPlayerId: number,
		weaponData: {
			weaponId: number;
			level: number;
		},
	]
>([createTypeChecker(t.number, t.strictInterface({ weaponId: t.number, level: t.number }))]);
export type Admin_ModifyWeaponLevelDefinition = typeof admin_ModifyWeaponLevelDefinition;
