import Net from "@rbxts/net";

export const deletePetsDefinition = Net.Definitions.ClientToServerEvent<[pets: ReadonlyArray<string>]>([]);
export type DeletePetsDefinition = typeof deletePetsDefinition;
