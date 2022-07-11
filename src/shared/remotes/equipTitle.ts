import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isValidTitle, ValidTitle } from "shared/configs/titles";

export const equipTitleDefinition = Net.Definitions.ClientToServerEvent<[title: ValidTitle]>([
	createTypeChecker(isValidTitle),
]);
export type EquipTitleDefinition = typeof equipTitleDefinition;
