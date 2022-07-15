import Net from "@rbxts/net";

export const toggleTimeOfDayDefinition = Net.Definitions.ClientToServerEvent<[_time: number]>();
export type ToggleTimeOfDayDefinition = typeof toggleTimeOfDayDefinition;
