import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isValidPetDistance } from "shared/rodux/settings";

export const togglePetsStudsOfDistanceDefinition = Net.Definitions.ClientToServerEvent<[studs: number]>([
	createTypeChecker(isValidPetDistance),
]);
export type TogglePetsStudsOfDistanceDefinition = typeof togglePetsStudsOfDistanceDefinition;
