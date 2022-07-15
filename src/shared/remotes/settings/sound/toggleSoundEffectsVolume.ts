import Net from "@rbxts/net";

export const toggleSoundEffectsVolumeDefinition = Net.Definitions.ClientToServerEvent<[volume: number]>();
export type ToggleSoundEffectsVolumeDefinition = typeof toggleSoundEffectsVolumeDefinition;
