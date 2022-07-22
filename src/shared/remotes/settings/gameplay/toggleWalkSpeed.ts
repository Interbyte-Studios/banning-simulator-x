import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isValidWalkSpeed } from "shared/rodux/settings";

export const toggleWalkSpeedDefinition = Net.Definitions.ClientToServerEvent<[walkSpeed: number]>([
	createTypeChecker(isValidWalkSpeed),
]);
export type ToggleWalkSpeedDefinition = typeof toggleWalkSpeedDefinition;
