import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const toggleButtonClickDefinition = Net.Definitions.ClientToServerEvent<[enabled: boolean]>([
	createTypeChecker(t.boolean),
]);
export type ToggleButtonClickDefinition = typeof toggleButtonClickDefinition;
