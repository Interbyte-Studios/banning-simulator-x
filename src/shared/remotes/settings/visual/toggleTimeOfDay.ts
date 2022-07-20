import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isValidTimeOfDay } from "shared/rodux/settings";

export const toggleTimeOfDayDefinition = Net.Definitions.ClientToServerEvent<[timeOfDay: number]>([
	createTypeChecker(isValidTimeOfDay),
]);
export type ToggleTimeOfDayDefinition = typeof toggleTimeOfDayDefinition;
