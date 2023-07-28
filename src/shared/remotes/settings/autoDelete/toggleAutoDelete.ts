import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const addOrRemoveToAutoDeleteDefinition = Net.Definitions.ClientToServerEvent<[petId: number]>([
	createTypeChecker(t.number),
]);
export type AddOrRemoveToAutoDeleteDefinition = typeof addOrRemoveToAutoDeleteDefinition;
