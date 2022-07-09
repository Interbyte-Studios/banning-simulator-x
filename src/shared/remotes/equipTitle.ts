import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isValidTitle, PossibleTitle } from "shared/configs/titles";

export const equipTitleDefinition = Net.Definitions.ClientToServerEvent<[title: PossibleTitle]>([
	createTypeChecker(isValidTitle),
]);
export type EquipTitleDefinition = typeof equipTitleDefinition;
