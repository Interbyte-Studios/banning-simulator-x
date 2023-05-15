import Net from "@rbxts/net";

export const tradeOfferDeclinedDefinition = Net.Definitions.ServerToClientEvent<[player: Player]>();
export type TradeOfferDeclinedDefinition = typeof tradeOfferDeclinedDefinition;
