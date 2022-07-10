import Net from "@rbxts/net";

export const togglePetsStudsOfDistanceDefinition = Net.Definitions.ClientToServerEvent<[studs: number]>();
export type TogglePetsStudsOfDistanceDefinition = typeof togglePetsStudsOfDistanceDefinition;
