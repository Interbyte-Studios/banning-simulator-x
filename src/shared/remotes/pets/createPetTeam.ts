import Net from "@rbxts/net";

export const createPetTeamDefinition = Net.Definitions.ClientToServerEvent<[pets: Array<string>]>([]);
export type CreatePetTeamDefinition = typeof createPetTeamDefinition;
