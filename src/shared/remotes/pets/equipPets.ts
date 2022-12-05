import Net from "@rbxts/net";

export const equipPetsDefinition = Net.Definitions.ClientToServerEvent<
	[pets: Array<{ guid: string; enabled: boolean }>]
>([]);
export type EquipPetsDefinition = typeof equipPetsDefinition;
