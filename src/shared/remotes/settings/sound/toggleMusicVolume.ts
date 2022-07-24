import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isValidVolume } from "shared/rodux/settings";

export const toggleMusicVolumeDefinition = Net.Definitions.ClientToServerEvent<[volume: number]>([
	createTypeChecker(isValidVolume),
]);
export type ToggleMusicVolumeDefinition = typeof toggleMusicVolumeDefinition;
