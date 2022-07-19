import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isValidGraphicsQuality, ValidGraphicsQuality } from "shared/rodux/settings";

export const toggleGraphicsDefinition = Net.Definitions.ClientToServerEvent<[quality: ValidGraphicsQuality]>([
	createTypeChecker(isValidGraphicsQuality),
]);
export type ToggleGraphicsDefinition = typeof toggleGraphicsDefinition;
