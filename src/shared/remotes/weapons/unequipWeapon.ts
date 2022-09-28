import Net from "@rbxts/net";

export const unequipWeaponDefinition = Net.Definitions.ClientToServerEvent<[]>([]);
export type UnequipWeaponDefinition = typeof unequipWeaponDefinition;
