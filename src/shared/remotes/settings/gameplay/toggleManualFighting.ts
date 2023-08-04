import Net from "@rbxts/net";

export const toggleManualFightingDefinition = Net.Definitions.ClientToServerEvent<[]>();
export type ToggleManualFightingDefinition = typeof toggleManualFightingDefinition;
