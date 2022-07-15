import Net from "@rbxts/net";

export const toggleMusicVolumeDefinition = Net.Definitions.ClientToServerEvent<[volume: number]>();
export type ToggleMusicVolumeDefinition = typeof toggleMusicVolumeDefinition;
