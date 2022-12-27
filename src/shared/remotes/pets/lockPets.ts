import Net from "@rbxts/net";

export const lockPetsDefinition = Net.Definitions.ClientToServerEvent<
	[pets: Array<{ guid: string; enabled: boolean }>]
>([]);
export type LockPetsDefinition = typeof lockPetsDefinition;
