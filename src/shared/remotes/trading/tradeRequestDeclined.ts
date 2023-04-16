import Net from "@rbxts/net";

export const tradeRequestDeclinedDefinition = Net.Definitions.ServerToClientEvent<[receivingPlayer: Player]>();
export type TradeRequestDeclinedDefinition = typeof tradeRequestDeclinedDefinition;
