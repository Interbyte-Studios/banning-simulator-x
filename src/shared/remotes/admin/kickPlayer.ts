import Net from "@rbxts/net";

export const admin_KickPlayerDefinition = Net.Definitions.ClientToServerEvent<[targetPlayerId: number]>([]);
export type Admin_KickPlayerDefinition = typeof admin_KickPlayerDefinition;
