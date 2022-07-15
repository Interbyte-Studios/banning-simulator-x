import Net from "@rbxts/net";

export const toggleButtonClickDefinition = Net.Definitions.ClientToServerEvent<[enabled: boolean]>();
export type ToggleButtonClickDefinition = typeof toggleButtonClickDefinition;
