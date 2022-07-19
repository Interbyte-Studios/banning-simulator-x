import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const toggleMusicVolumeDefinition = Net.Definitions.ClientToServerEvent<[volume: number]>([
	createTypeChecker(t.number),
]);
export type ToggleMusicVolumeDefinition = typeof toggleMusicVolumeDefinition;
