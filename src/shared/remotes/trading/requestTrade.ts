import Net from "@rbxts/net";

export const requestTradeDefinition = Net.Definitions.ClientToServerEvent<[targetPlayer: Player]>([]);
export type RequestTradeDefinition = typeof requestTradeDefinition;
