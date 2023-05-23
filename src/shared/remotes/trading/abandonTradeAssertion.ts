import Net from "@rbxts/net";

// Sends to the trade creator that the receiving player accepted trade
export const abandonTradeAssertionDefinition = Net.Definitions.ServerToClientEvent<[]>();
export type AbandonTradeAssertionDefinition = typeof abandonTradeAssertionDefinition;
