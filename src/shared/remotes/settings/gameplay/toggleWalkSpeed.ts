import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const toggleWalkSpeedDefinition = Net.Definitions.ClientToServerEvent<[walkSpeed: number]>([
	createTypeChecker(t.number),
]);
export type ToggleWalkSpeedDefinition = typeof toggleWalkSpeedDefinition;
