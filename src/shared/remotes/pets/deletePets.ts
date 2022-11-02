import Net from "@rbxts/net";

export const deletePetsDefinition = Net.Definitions.ClientToServerEvent<[pets: Array<string>]>([]);
export type DeletePetsDefinition = typeof deletePetsDefinition;
