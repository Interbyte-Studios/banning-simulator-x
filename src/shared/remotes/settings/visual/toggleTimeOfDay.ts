import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const toggleTimeOfDayDefinition = Net.Definitions.ClientToServerEvent<[timeOfDay: number]>([
	createTypeChecker(t.number),
]);
export type ToggleTimeOfDayDefinition = typeof toggleTimeOfDayDefinition;
