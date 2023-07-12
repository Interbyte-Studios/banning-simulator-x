import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const deletePetsDefinition = Net.Definitions.ClientToServerEvent<[pets: ReadonlyArray<string>]>([
	createTypeChecker(t.strictArray(t.string)),
]);
export type DeletePetsDefinition = typeof deletePetsDefinition;
