import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const equipTalismanDefinition = Net.Definitions.ClientToServerEvent<[taslismanId: number]>([
	createTypeChecker(t.integer),
]);
export type EquipTalismanDefinition = typeof equipTalismanDefinition;
