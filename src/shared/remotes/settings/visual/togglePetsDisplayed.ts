import Net from "@rbxts/net";

export const togglePetsDisplayedDefinition = Net.Definitions.ClientToServerEvent<[displayed: boolean]>();
export type TogglePetsDisplayedDefinition = typeof togglePetsDisplayedDefinition;
