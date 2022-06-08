import Net from "@rbxts/net";

export const toggleAutoHatchDefinition = Net.Definitions.ClientToServerEvent<[enabled: boolean]>();
export type ToggleAutoHatchDefinition = typeof toggleAutoHatchDefinition;
