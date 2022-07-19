import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const togglePetsStudsOfDistanceDefinition = Net.Definitions.ClientToServerEvent<[studs: number]>([
	createTypeChecker(t.number),
]);
export type TogglePetsStudsOfDistanceDefinition = typeof togglePetsStudsOfDistanceDefinition;
