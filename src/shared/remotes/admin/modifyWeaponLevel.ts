import Net from "@rbxts/net";

export const admin_ModifyWeaponLevelDefinition = Net.Definitions.ClientToServerEvent<
	[
		targetPlayerId: number,
		weaponData: {
			weaponId: number;
			level: number;
		},
	]
>([]);
export type Admin_ModifyWeaponLevelDefinition = typeof admin_ModifyWeaponLevelDefinition;
