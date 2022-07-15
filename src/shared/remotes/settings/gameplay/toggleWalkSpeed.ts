import Net from "@rbxts/net";

export const toggleWalkSpeedDefinition = Net.Definitions.ClientToServerEvent<[walkSpeed: number]>();
export type ToggleWalkSpeedDefinition = typeof toggleWalkSpeedDefinition;
