import Net from "@rbxts/net";

export const togglePublicInventoryDefinition = Net.Definitions.ClientToServerEvent<[]>();
export type TogglePublicInventoryDefinition = typeof togglePublicInventoryDefinition;
