import Net from "@rbxts/net";

export const equipWeaponDefinition = Net.Definitions.ClientToServerEvent<[]>([]);
export type EquipWeaponDefinition = typeof equipWeaponDefinition;
