import Net from "@rbxts/net";

export const toggleMasterVolumeDefinition = Net.Definitions.ClientToServerEvent<[volume: number]>();
export type ToggleMasterVolumeDefinition = typeof toggleMasterVolumeDefinition;
