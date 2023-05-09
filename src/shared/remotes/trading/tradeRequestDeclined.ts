import Net from "@rbxts/net";

// Sends to the trade creator that the receiving player declined trade
export const tradeRequestDeclinedDefinition = Net.Definitions.ServerToClientEvent<[receivingPlayer: Player]>();
export type TradeRequestDeclinedDefinition = typeof tradeRequestDeclinedDefinition;
