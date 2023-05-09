import Net from "@rbxts/net";

// Sends to the trade creator that the receiving player accepted trade
export const tradeRequestAcceptedDefinition = Net.Definitions.ServerToClientEvent<[receivingPlayer: Player]>();
export type TradeRequestAcceptedDefinition = typeof tradeRequestAcceptedDefinition;
